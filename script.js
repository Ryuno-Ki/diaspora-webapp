document.getElementById('submitButton').addEventListener('click', redirect, false);

function removeOldAlert() {
  var oldAlert = document.getElementById('alert');
  if (oldAlert != null) {
    /* Since DOM does not provide a way to delete sth, workaround this way.
     * It isn't removed in Memory, though (hence assigning null) */
    oldAlert.parentNode.removeChild(oldAlert);
    oldAlert = null;
  }
}

function alertUser(handle) {
  removeOldAlert();
  var newAlert = document.createElement('li');
  var msg = document.createTextNode('"' + handle + '" is not a correct handle!');
  var podUrl = document.getElementById('podurl');

  /* Everytime, an element with role="alert" is inserted into the DOM the
   * browser fires an alert-event, which can be listened on by assistive
   * technology. Hence removing maybe existing one first and insert a new one
   * */
  newAlert.setAttribute('role', 'alert');
  newAlert.setAttribute('id', 'error');
  newAlert.appendChild(msg);
  podUrl.parentNode.appendChild(newAlert);
}

function redirect() {
  var handle = document.getElementById('podurl');
  var pod = handle.value;
  var handleRegExp = new RegExp(/[A-Za-z0-9_]+@(([a-zA-Z0-9\-]*)\.)+([A-Za-z0-9\-]{2,})/);
  var validatedHandle = handleRegExp.test(pod);
  
  if (!validatedHandle) {
    alertUser(pod);
    handle.setAttribute('aria-invalid', validatedHandle);
  } else {
    handle.setAttribute('aria-invalid', validatedHandle);
    var splitted = pod.split('@');
    /* Usually one has to announce a redirect first, but the submit button
     * should implicit this here */
    window.location = 'https://' + splitted[1] + '/users/sign_in?user[username]=' + splitted[0];
  }
}
