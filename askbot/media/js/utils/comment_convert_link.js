var CommentConvertLink = function (comment_id) {
    WrappedElement.call(this);
    this._comment_id = comment_id;
};
inherits(CommentConvertLink, WrappedElement);

CommentConvertLink.prototype.createDom = function () {
    var element = this.makeElement('form');
    element.addClass('convert-comment');
    element.attr('method', 'POST');
    element.attr('action', askbot.urls.convertComment);
    var hidden_input = this.makeElement('input');
    hidden_input.attr('type', 'hidden');
    hidden_input.attr('value', this._comment_id);
    hidden_input.attr('name', 'comment_id');
    element.append(hidden_input);

    var csrf_token = this.makeElement('input');
    csrf_token.attr('type', 'hidden');
    csrf_token.attr('name', 'csrfmiddlewaretoken');
    csrf_token.attr('value', getCookie(askbot.settings.csrfCookieName));
    element.append(csrf_token);

    var submit = this.makeElement('a');
    submit.addClass('submit-link dropdown-item');
    //submit.attr('type', 'submit');
    submit.html('<span class="icon"> <i class="fas fa-circle-exclamation"></i> </span><span>' + 
        gettext('convert to answer') + '</span>');
    element.append(submit);
    this.decorate(element);
    this.getElement().trigger('askbot.afterCommentConvertLinkDecorate', [this]);
};


CommentConvertLink.prototype.decorate = function (element) {
    this._element = element;
    this._element.children(".submit-link").click((e) => {
        this._element.submit();
    });
};