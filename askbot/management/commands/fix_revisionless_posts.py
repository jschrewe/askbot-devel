"""this management commands will fix corrupted posts
that do not have revisions by creating a fake initial revision
based on the content stored in the post itself
"""

from django.core.management import BaseCommand
from django.db.models import signals, Count
from askbot import models
from askbot import const
from askbot.utils.console import ProgressBar

def fix_revisionless_posts(post_class):
        posts = post_class.objects.annotate(
                                        rev_count = Count('revisions')
                                    ).filter(rev_count = 0)
        count = len(posts)
        print(f'have {count} corrupted posts')
        message = 'Adding missing revisions:'
        for post in ProgressBar(posts.iterator(), count, message):
            rev = post.add_revision(
                        author=post.author,
                        text=post.text,
                        comment=str(const.POST_STATUS['default_version']),
                        revised_at=post.added_at
                    )
            post.last_edited_at = None
            post.last_edited_by = None
            post.current_revision = rev
            post.save()

class Command(BaseCommand):
    """Command class for "fix_answer_counts"
    """

    def remove_save_signals(self):
        """removes signals on model pre-save and
        post-save, so that there are no side-effects
        besides actually updating the answer counts
        """
        signals.pre_save.receivers = []
        signals.post_save.receivers = []

    def handle(self, *arguments, **options):
        """function that handles the command job
        """
        self.remove_save_signals()
        fix_revisionless_posts(models.Post)
