window.addEventListener("load", init, false);

function init() {
  document.getElementById('login-form').addEventListener('submit', submit, false);
  
  /* Firefox throws errors randomly:
   * SecurityError: The operation is insecure.
   * if (window.localStorage.length > 0) {…}
   *
   * As far as I have found out, it may depends on DOM status:
   * see http://stackoverflow.com/q/13852209
   * and http://stackoverflow.com/q/3698200
   * Maybe a good point to use some additional JavaScript libraries to abstract
   * these issues away?
   * Or I ran into this problem:
   * http://meyerweb.com/eric/thoughts/2012/04/25/firefox-failing-localstorage/
   */
  if (window.localStorage.length > 0) {
    var div = document.getElementById('previousHandles');
    
    /* Modify indications */
    var existingHandlesLabel = document.createElement('p');
    existingHandlesLabel.setAttribute('id', 'existing-handles-label');
    existingHandlesLabel.appendChild(document.createTextNode('Please select one of your handles:'));
    div.appendChild(existingHandlesLabel);
    
    document.getElementById('podurl-label').textContent = 'Or enter a new one below:';
    
    /* Add previous handles to a list */
    var ul = document.createElement('ul');
    for (var i = 0; i < window.localStorage.length; i++) {
      var handleCandidate = window.localStorage.key(i);
      /* It may happen, that localStorage is polluted by other data.*/
      if (validateHandle(handleCandidate)) {
        var handle = handleCandidate;
      } else {
	console.log('Discarding ' + handleCandidate + ' from suggested handles.');
        continue;
      }
      var li = document.createElement('li');
      var linkToPod = document.createElement('a');
      var removeIcon = document.createElement('img');
      var removeString = 'Remove this handle!';
      
      linkToPod.setAttribute('href', getUrl(handle));
      linkToPod.setAttribute('title', 'Go to my pod!');
      linkToPod.appendChild(document.createTextNode(handle));
      
      removeIcon.setAttribute('src', './design/monotone_close_exit_delete.png');
      removeIcon.setAttribute('alt', removeString);
      removeIcon.setAttribute('title', removeString);
      removeIcon.setAttribute('class', 'deleteHandle');
      removeIcon.setAttribute('data-handle', handle);
      removeIcon.addEventListener('click', deleteHandle, false);
      
      li.appendChild(removeIcon);
      li.appendChild(linkToPod);
      ul.appendChild(li);
    }
    div.appendChild(ul);
  }
}

function submit(e) {
  e.preventDefault();
  var handleElement = document.getElementById('podurl');
  var handle = handleElement.value;
  var validatedHandle = validateHandle(handle);

  /* I need a validatedHandle var later on in the a11y branch */
  if (!validatedHandle) {
    /* This condition block will be replaced later */
    var error_message = document.getElementById('error');
    error_message.className = '';
    error_message.textContent = '"' + handle + '" is not a correct handle!';
  } else {
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

function validateHandle(handle) {
  var handleRegExp = new RegExp(/[A-Za-z0-9_]+@(([a-zA-Z0-9\-]*)\.)+([A-Za-z0-9\-]{2,})/);
  return handleRegExp.test(handle);
}

function deleteHandle(event) {
  var img = event.target;
  var listElem = img.parentNode;
  
  /* Remove the handle in the localStorage */
  window.localStorage.removeItem(img.dataset.handle);
  /* Remove the element from the list */
  listElem.parentNode.removeChild(listElem);
  listElem = null;  
  
  if (window.localStorage.length == 0) {
    var existingHandlesLabel = document.getElementById('existing-handles-label');
    existingHandlesLabel.parentNode.removeChild(existingHandlesLabel);
    existingHandlesLabel = null;  
    document.getElementById('podurl-label').textContent = 'Please enter your diaspora* handle:';
  }
}
