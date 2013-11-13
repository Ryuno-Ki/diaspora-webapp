window.addEventListener("load", init, false);

function init() {
  document.getElementById('submitButton').addEventListener('click', submit, false);
  
  if (window.localStorage.length > 0) {
    var list = document.getElementById("previousHandles");
    
    for (var i = 0; i < window.localStorage.length; i++) {
      var handle = window.localStorage.key(i);
      var li = document.createElement('li');
      var linkToPod = document.createElement('a');
      // Icon was not shipped in my branch. Hence replacing it with span for now
      //var removeIcon = document.createElement('img');
      var removeIcon = document.createElement('span');
      var removeString = "Remove this handle";
      
      linkToPod.setAttribute('href', getUrl(handle));
      linkToPod.setAttribute('title', 'Go to my pod!');
      linkToPod.appendChild(document.createTextNode(handle));
      
      //removeIcon.setAttribute('src', './design/monotone_close_exit_delete.png');
      removeIcon.setAttribute('alt', removeString);
      removeIcon.setAttribute('title', removeString);
      removeIcon.setAttribute('class', 'deleteHandle');
      removeIcon.setAttribute('data-handle', handle);
      removeIcon.addEventListener('click', deleteHandle, false);
      
      li.appendChild(removeIcon);
      li.appendChild(linkToPod);
      list.appendChild(li);
    }
  }
}

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

function submit(e) {
  e.preventDefault();
  var handleElement = document.getElementById('podurl');
  var handle = handleElement.value;
  var handleRegExp = new RegExp(/[A-Za-z0-9_]+@(([a-zA-Z0-9\-]*)\.)+([A-Za-z0-9\-]{2,})/);
  var validatedHandle = handleRegExp.test(handle);

  if (!validatedHandle) {
    alertUser(pod);
    handle.setAttribute('aria-invalid', validatedHandle);
  } else {
    handleElement.setAttribute('aria-invalid', validatedHandle);
    /* Store the handle in the localStorage
     * Firefox claims, that this is insecure */
    window.localStorage.setItem(handle, "");
    /* Redirect to the pod */
    window.location = getUrl(handle);
  }
}

function getUrl(handle) {
    /* Usually one has to announce a redirect first, but the submit button
     * should implicit this here */
    var splitted = handle.split('@');
    return 'https://' + splitted[1] + '/users/sign_in?user[username]=' + splitted[0];
}

function deleteHandle(event) {
  var img = event.target;
  var listElem = img.parentNode;
  
  /* Remove the handle in the localStorage */
  window.localStorage.removeItem(img.dataset.handle);
  /* Remove the element from the list */
  listElem.parentNode.removeChild(listElem);
  listElem = null;
}
