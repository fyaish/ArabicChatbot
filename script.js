$(document).ready(function(){
// reference to firebase JSON tree
  var messagesRef = new Firebase('https://arabicchatbot.firebaseio.com/messages/');

  // cache DOM references
  var messageField = $('#messageInput'),
  nameField = $('#nameInput'),
  messageList = $('#messages'),
  onlineList = $('#online-users');

  // press event ENTER key
  messageField.keypress(function (e) {
    if (e.keyCode == 13) {
      var username = nameField.val();
      var message = messageField.val();

      //register data to firebase
      messagesRef.push({name:username, text:message});
      messageField.val('');
    }
  });

  // Add a callback that is triggered for each chat message.
  messagesRef.limitToLast(10).on('child_added', function (snapshot) {
    //get data
    var data = snapshot.val();
    var username = data.name || "anonymous";
    var message = data.text;

    //only if username and message = true then display username,message
    if (username && message) {

    //create element message and sanitize text
    var text = "says";
    var messageElement = $("<li>");
    var nameElement = $("<strong class='name'></strong>");
    nameElement.text(username.concat(' ' +text+ ' '));
    messageElement.text(message).prepend(nameElement);

    //add message
    messageList.append(messageElement);

    //scroll to bottom in messages
    messageList[0].scrollTop = messageList[0].scrollHeight;
  }
  });

  var listRef = new Firebase("https://arabicchatbot.firebaseio.com/presence/");
  var userRef = listRef.push();

  // Add ourselves to presence list when online
  var presenceRef = new Firebase("https://arabicchatbot.firebaseio.com/.info/connected");
  presenceRef.on("value", function(snap) {
    if (snap.val()) {
      userRef.set(true);
      // Remove ourselves when we disconnect
      userRef.onDisconnect().remove();
    }
  });

  // Number of online users is the number of objects in the presence list.
  listRef.on("value", function(snap) {
    //display number of online users in online-users
    onlineList.text(snap.numChildren());
  });

});
