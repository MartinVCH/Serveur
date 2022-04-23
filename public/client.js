
/* -----class Email-----
Defines objects of type Email */
class Email {
	toAddress;
	fromAddress;
	subject;
	body;
	constructor(toAddress, fromAddress, subject, body) { //array contactList
		this.toAddress = toAddress;
		this.fromAddress = fromAddress;
		this.subject = subject;
		this.body = body;
		console.log("New Email Created...");
		//this.afficher();
	}
}
/*-----class Inbox-----
static class with all static methods 
related to Inbox and its messages */
class Inbox {
	static filterSearch() {
		let input, filter, table, tr, td, i, txtValue;
		input = document.getElementById('searchstring'); // sets input
		filter = input.value.toUpperCase();
		table = document.getElementById("inboxTable");
		tr = table.getElementsByTagName('tr');
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0];
			if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}

	static loadHTML() { //injects content of inbox in HTML
		//test inbox;
		let inbox = [ // inbox represents a table with all objects related to emails. inbox is a set of emails. 
			{
				from: 		'Dylan',
				subject: 	'des nouvelles',
				content: 	'Bonjour, comment ca va',
				date: 		'aujourd hui'
			},
			{
				from: 		'george',
				subject: 	'tbnk bigs',
				content: 	'tu es un fou toi ',
				date: 		'hier'
			}
		];

		const inboxContents = document.getElementById('inboxContents');
		let htmlNode = '';
		for (let email of inbox) {
			htmlNode += '<tr><td>' + email.from + '</td><td>' + email.subject + '</td><td>' + email.content + '</td><td>' + email.date + '</td></tr>'; // adds a row in the table
		}
		inboxContents.innerHTML = htmlNode; //adds string content to HTML document
	}
}
/*-----class Outbox-----
static class with all static methods 
related to Outbox and its messages */
class Outbox {
	static loadHTML(){
		console.log("loading Messags from server to DOM...");
        fetch("/getLetters")
        .catch(err => alert(err))
        .then(resp => resp.json())
        .then(msgs => {
			let htmlNode = '';
            msgs.forEach( encryptedMsg => {
				try{
					console.log("Encrypted Message: "+encryptedMsg); //type string.
					var decryptedMessage = forge.util.decodeUtf8(keyPair.privateKey.decrypt(forge.util.decode64(encryptedMsg)));
					var email = JSON.parse(decryptedMessage);
					console.log("decrypted message is of type : "+typeof email+ "and is the following: "+email);

					htmlNode += '<tr><td>'+email.toAddress +'</td><td>' + email.fromAddress +'</td><td>'+email.subject+'</td><td>'+email.body+'</td></tr>';
				}catch(err){
					alert("COULD NOT GET MESSAGES"+err);
				}
            });
			OUTBOX_CONTENTS.innerHTML = htmlNode;
        });
	}
    /**
     * @function postMessageToServer() Email.toString().encrypt().post():
     * 1. Convert from email to string
     * 2. Encrypt the string
     * 3. Post the string.   
     * @param {Email} newEmail is an email to add to the server. */
    static postMessageToServer(newEmail){
        console.log("Posting a message on the server...");
		try{
			//encryps the object email. 
			var encryptedMsg = forge.util.encode64( keyPair.publicKey.encrypt(forge.util.encodeUtf8(JSON.stringify(newEmail))));
			console.log("encrypted the message successfully : " + encryptedMsg);
			alert("encrypted the message successfully");

			//makes a request to add a message to the server: 
			fetch("/addLetter", { method: "POST", body: encryptedMsg})
				.then( response => {
					console.log(`Message envoyé: ${encryptedMsg}`);
				})
				.catch( err => alert(err));
		}catch (err){
			console.log("could not fetch the messages : "+ err);
			alert("could not get the messages from the server...");
		}
		// load The HTML with the new outgoing message. 
		Outbox.loadHTML();
    }
    /**
     * @function filterSearch() filters the search for the messages. */
	static filterSearch() {
		let input, filter, table, tr, td, i, txtValue;
		input = document.getElementById('searchstring'); // sets input
		filter = input.value.toUpperCase();
		table = document.getElementById("outboxTable");
		tr = table.getElementsByTagName('tr');
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0];
			if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}
    /**
     * @function clear() clears local storage */
	static clear(){
		// unimplemented method...
	 	this.loadHTML();
	}
}

/*-----class Contact-----
Defines objects of type Contact */
class Contact {

	prenom;
	nom;
	addresseCourriel;

	constructor(prenom, nom, addresseCourriel) {
		this.prenom = prenom;
		this.nom = nom;
		this.addresseCourriel = addresseCourriel;
	}

}

/*-----class AddressBook-----
static class with all static methods 
related to AddressBook and its contacts */
class AddressBook {
	static contacts = [];

	static afficher() { //print for debug the contactlist
		for (let contact of this.contacts) {
			//console.log("Prenom:" + contact.prenom + "\nNom:"+contact.nom+"\nCourriel:"+contact.addresseCourriel);
		}
	}

	static loadHTML() { //injects content of inbox in HTML
		//injects content in HTML
		let htmlNode = '';

		console.log(typeof this.contacts);
		for (let contact of this.contacts) {
			htmlNode += '<tr><td>' + contact.prenom + '</td><td>' + contact.nom + '</td><td>' + contact.addresseCourriel + '</td></tr>'; // adds a row in the table
		}
		CONTACTS_CONTENTS.innerHTML = htmlNode; //adds string content to HTML document
	}

	static save() {
		localStorage.setItem("Contacts", JSON.stringify(this.contacts)); // add to local storage
		//console.log("retreivedContacts", JSON.parse(localStorage.getItem("Contacts")));    // retreive outbox from storage for debuging
	}

	static getContactsFromStorage() {
		console.log("Getting contacts from localstorage...");

		let contactsLastSave = JSON.parse(localStorage.getItem("Contacts"));

		if (contactsLastSave == null) {
			//does not exist in local storage
			console.log("Contacts does not exist in localStorage...");
		} else {
			//exists in local storage
			console.log("Contacts exists in localStorage...");
			if (typeof contactsLastSave == "object") {
				console.log("Contacts is verified...");
				this.contacts = contactsLastSave; //if everything checks out, modify the attribute of messages;
				this.afficher();
			} else {
				console.log("Contacts is not of the proper type");
			}
		}
	}

	static addContact() {
		console.log("adding contact...");
		//get values from fields.
		const prenom = INPUT_FIELD_PRENOM.value; //type: string
		const nom = INPUT_FIELD_NOM.value; //type: string
		const addresse = INPUT_FIELD_ADDRESSE.value; //type: string


		console.log(prenom+nom+addresse);

		if (addresse && nom && prenom && addresse.includes("@") && ((addresse.includes(".ca")|| addresse.includes(".com")))) {
			//all entries are not null
			let newContact = new Contact(prenom, nom, addresse); //create a new object email

			this.contacts.push(newContact);
			this.loadHTML(); // loads addressbook in dom
			this.afficher(); // displays in console.
			this.save();     // saves to localStorage. 

		} else {
			console.log("ERROR: missing field...")
		};

	}
	static filterSearch() {
		let input, filter, table, tr, td, i, txtValue;
		input = document.getElementById('searchstring'); // sets input
		filter = input.value.toUpperCase();
		table = document.getElementById("contactTable");
		tr = table.getElementsByTagName('tr');
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0];
			if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}
	static clear(){
		localStorage.removeItem("Contacts");
		this.contacts = [];
		this.loadHTML();
	}
	
}

/*-----class Interface -----
static class with all static methods 
related to the web interface */
class Interface {

	static INBOX_TABLE = document.getElementById("inboxTable");
	static OUTBOX_TABLE = document.getElementById("outboxTable");
	static CONTACTS_TABLE = document.getElementById("contactTable");
	static NEW_MESSAGE = document.getElementById("box");
	static NEW_ADDRESS = document.getElementById("newAddressForm");
	static DELETE_CONTACTS = document.getElementById("clearLocalStorageContacts");
	static DELETE_OUTBOX = document.getElementById("clearLocalStorageOutbox");

	static showInbox() {
		this.INBOX_TABLE.style.display = "table";
	};
	static hideInbox() {
		this.INBOX_TABLE.style.display = "none";
	};

	static showOutbox() {
		this.OUTBOX_TABLE.style.display = "table";
	};
	static hideOutbox() {
		this.OUTBOX_TABLE.style.display = "none";
	};

	static showContacts() {
		this.CONTACTS_TABLE.style.display = "table";
	};
	static hideContacts() {
		this.CONTACTS_TABLE.style.display = "none";
	};

	static showNewMessage() {
		this.NEW_MESSAGE.style.display = "block"
	};
	static hideNewMessage() {
		this.NEW_MESSAGE.style.display = "none";
	};

	static showNewAddress() {
		this.NEW_ADDRESS.style.display = "block";
	};
	static hideNewAddress() {
		this.NEW_ADDRESS.style.display = "none"
	};

	static showDeleteContacts(){
		this.DELETE_CONTACTS.style.display = "block";
	}
	static hideDeleteContacts(){
		this.DELETE_CONTACTS.style.display = "none";
	}

	static showDeleteOutbox(){
		this.DELETE_OUTBOX.style.display = "block";
	}
	static hideDeleteOutbox(){
		this.DELETE_OUTBOX.style.display = "none";
	}
}

/*-------------------------------DOM methods---------------------------------------*/

/*DOM CONSTANTS
constants are used throuhgout the script to reference HTML nodes.*/
const INPUT_FIELD_TO = document.getElementById("emailAddress");
const INPUT_FIELD_CC = document.getElementById("emailAddress2");
const INPUT_FIELD_SUBJECT = document.getElementById("subject");
const INPUT_FIELD_BODY = document.getElementById("message");
const BUTTON_SEND = document.getElementById("sendButton");

const BUTTON_SENT_ITEMS = document.getElementById("sentItemsButton");
const OUTBOX_CONTENTS = document.getElementById("outboxContents");
const CONTACTS_CONTENTS = document.getElementById("contactListContents");
const BUTTON_ADD_CONTACT = document.getElementById("buttonAddContact");
const INPUT_FIELD_PRENOM = document.getElementById("firstName");
const INPUT_FIELD_NOM = document.getElementById("LastName");
const INPUT_FIELD_ADDRESSE = document.getElementById("contactEmailAddress");

/**
 * @function window.onload(); => event enduced when window is loaded. */
window.onload = function () { // event enduced when you open the file.
	console.log("Enter Window.onload Event...");
	goToInbox();
	Inbox.loadHTML();
	Outbox.loadHTML();                  	// loads outgoing messages in HTML 
	AddressBook.getContactsFromStorage();
	AddressBook.loadHTML();
	console.log("Exit Window.onload Event...");
};
/**
 * @function dropDownMenu() is a script for dropdown botton for the sidebar menu (self-invoked method) */
(function dropDownMenu() {
	var dropdown = document.getElementsByClassName("dropdown-btn");
	for (var i = 0; i < dropdown.length; i++) {
		dropdown[i].addEventListener("click", function () {
			this.classList.toggle("active");
			var dropdownContent = this.nextElementSibling;
			if (dropdownContent.style.display === "block") {
				dropdownContent.style.display = "none";
			} else {
				dropdownContent.style.display = "block";
			}
		})
	}
})();

// To Search in the inbox array => Method is a property of Search Element in DOM.
function filterSearch() {
	Inbox.filterSearch();       //filters through the Inbox;
	Outbox.filterSearch();      //filters through the sent mail.
	AddressBook.filterSearch(); //filters through the AddressBook.
}

function sendEmail() { //action performed

	console.log("Submit email button was pressed!...");
	//get values from fields.
	const toAddress = INPUT_FIELD_TO.value; 		//type: string
	const subject 	= INPUT_FIELD_SUBJECT.value; 	//type: string
	const body 		= INPUT_FIELD_BODY.value; 		//type: string
	//Address est la public key...
	//const fromAddress = forge.pki.publicKeyToPem(keyPair.publicKey); 
	const fromAddress = "me@gmail.com";

	if (toAddress && subject && body && toAddress.includes("@") && ((toAddress.includes(".ca")) || (toAddress.includes(".com")))) {
		console.log("Email Entries seem legit...");
		//all entries are not null, exept CC...

		let newEmail = new Email(toAddress, fromAddress, subject, body);  //create a new object email
		Outbox.postMessageToServer(newEmail);                           // adds the email to the server.
		BUTTON_SEND.style.display ="none";
	
	} else {
		console.log("ERROR: missing field...");
	};
};

//function is implemented by DOM 
function goToSentItems() {
	console.log("'sent Items' Button was pressed...");
	Interface.hideInbox();
	Interface.showOutbox();
	Interface.hideNewAddress();
	Interface.hideContacts();
	Interface.hideDeleteContacts();
	//Interface.showDeleteOutbox();
}

function goToInbox() {
	console.log("'inbox' Button was pressed...");
	Interface.showInbox();
	Interface.hideOutbox();
	Interface.hideNewAddress();
	Interface.hideContacts();
	Interface.hideDeleteContacts();
	Interface.hideDeleteOutbox();
}

function goToContacts() {
	console.log("Go to Contacts was triggered...");
	Interface.showContacts();
	Interface.showNewAddress();
	Interface.hideOutbox();
	Interface.hideInbox();
	Interface.hideNewMessage();
	Interface.showDeleteContacts();
	Interface.hideDeleteOutbox();
}

function goToNewMessage() {
	Interface.showNewMessage();
	Interface.hideNewAddress();
}

// to clear the local storage
function clearLocalStorageOutbox() {
	const answerClearOutbox = confirm('Are you sure you want to delete all sent items?');
	if (answerClearOutbox){
		Outbox.clear();
	}
}

function clearLocalStorageContacts() {
	const answerClearContacts = confirm('Are you sure you want to delete all contacts?');
	if (answerClearContacts){
		AddressBook.clear();
	}
}


/**
 * @getKeyPair  gets the keypair from local Storage or generates one if none exists. 
 * @returns     the keypair to be used to interface with server. */
 function getKeyPair(){
    var keyPair, pem = localStorage.getItem("pem");
    //if there is a key in localStorage: 
    if(pem){
        console.log("Getting key from localStorage...");
        privateKey = forge.pki.privateKeyFromPem(pem);
        publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
        keyPair = {privateKey, publicKey};
    }else{
        console.log("generating a NEW key...");
        //there is no key in local Storage.
        //generate a new keypair:
        keyPair = forge.pki.rsa.generateKeyPair({bits: 1024});
        //add the new keypair to local Storage: 
        localStorage.setItem("pem",forge.pki.privateKeyToPem(keyPair.privateKey));
    }
    return keyPair;
}
/**
* Program starts below:
* 
*/
keyPair = getKeyPair();
(function main(){
    alert("JavaScript is running!");
    //Generates a keypair object with RSA protocol.:
    console.log("Public Key: \n"+forge.pki.publicKeyToPem(keyPair.publicKey));
})();