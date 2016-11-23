function sendMessage (msg_input_node) 
{
	message_srting = msg_input_node.value;
	if (message_srting.trim()) {
		log_node = document.getElementById('chatLog');
		p_node = document.createElement("P");
		p_node.className = "message float-right"
		msg_node = document.createTextNode(message_srting);
		p_node.appendChild(msg_node);
		if (log_node.lastChild != null) {
			margin = (1 - log_node.lastChild.offsetWidth/chatLog.offsetWidth)*87;
			log_node.lastChild.style.marginLeft = margin+"%";
		}
		log_node.appendChild(p_node);
		log_node.scrollTop = log_node.scrollHeight; 
		msg_input_node.value="";
		msg_input_node.focus();
	}
}

function sendMsgHandler(e)
{
	if (e.keyCode==13 || e.which==13) {
		msg_input_node = document.getElementById("chatInput");
		sendMessage(msg_input_node);
	}
	return false;
}

/*function chat(){

	if (document.readyState != "complete") {
		console.warn('%c Document not ready. Failed to create chatBox.', 'color:#710609;');
		return false;
	}
	console.info('creating chatBox');
	
	this.chatBox = document.createElement("DIV");
	this.chatBox.className = "chat-box";
	
	chatLog = document.createElement("DIV");
	chatLog.setAttribute("id", "chatLog");
	chatLog.className="chat-log";
	
	chatForm = document.createElement("DIV");
	chatForm.className="chat-form";

	msg_input_node = document.createElement("INPUT");
	msg_input_node.setAttribute("type","text");
	msg_input_node.setAttribute("id","chatInput");
	msg_input_node.setAttribute("placeholder","Enter message");
	msg_input_node.className = "msg-input";
	msg_input_node.value="";
	this.msg_input_node = msg_input_node;

	send_msg_btn = document.createElement("BUTTON");
	send_msg_btn.setAttribute("id","send_btn");
	send_msg_btn.className="send-btn";
	text_node = document.createTextNode("SEND");
	send_msg_btn.appendChild(text_node);

	send_msg_btn.addEventListener("click", function(){
		message_string = msg_input_node.value;
		if (message_string.trim()) {
			log_node = chatLog;
			p_node = document.createElement("P");
			p_node.className = "message float-right"
			msg_node = document.createTextNode(message_string);
			p_node.appendChild(msg_node);
			if (log_node.lastChild != null) {
				margin = (1 - log_node.lastChild.offsetWidth/chatLog.offsetWidth)*87;
				log_node.lastChild.style.marginLeft = margin+"%";
			}
			log_node.appendChild(p_node);
			log_node.scrollTop = log_node.scrollHeight; 
			msg_input_node.value="";
		}
	});

	chatForm.appendChild(msg_input_node);
	chatForm.appendChild(send_msg_btn);

	this.chatBox.appendChild(chatLog);
	this.chatBox.appendChild(chatForm);

	return this.chatBox;

}*/