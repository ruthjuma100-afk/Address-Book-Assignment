// mini TDD helpers
function test(description, fn) {
    try {
        fn();
         console.log(description);
    } catch (error) {
         console.error(description);
         console.error(error.message);
    }
}

function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`${value} is not ${expected}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(value) !== JSON.stringify(expected)) {
                throw new Error("Values are not equal");
            }
        },
        toBeDefined() {
            if (value === undefined) {
                throw new Error("Value is undefined");
            }
        },
        toBeType(type) {
            if (typeof value !== type) {
                throw new Error(`Expected ${type}, got ${typeof value}`);
            }
        }
    };
}


// address book constructor
function AddressBook(storage = localStorage) {
    this.storage = storage;
    this.contacts = JSON.parse(storage.getItem("contacts")) || [];
}

// add contact
AddressBook.prototype.addContact = function (contact) {
    this.contacts.push(contact);
    this.saveContacts();
};

// Delete contact
AddressBook.prototype.deleteContact = function (id) {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.saveContacts();
    this.displayContacts();
};

// Display contacts
AddressBook.prototype.displayContacts = function () {
    const contactList = document.getElementById("contactList");
    if (contactList) {
        contactList.innerHTML = "";

        this.contacts.forEach(contact => {
            const li = document.createElement("li");

            li.innerHTML = `
                <span>
                    <strong>${contact.name}</strong><br>
                    📞 ${contact.phone}<br>
                    ✉️ ${contact.email || "No email"}
                </span>
                <span class="delete" data-id="${contact.id}">❌</span>
            `;

            contactList.appendChild(li);
        });
    }
};

// Save contacts
AddressBook.prototype.saveContacts = function () {
    this.storage.setItem("contacts", JSON.stringify(this.contacts));
};

// Contact constructor 
let idCounter = 0;
function Contact(name, phone, email) {
    this.id = Date.now() + (idCounter++);
    this.name = name;
    this.phone = phone;
    this.email = email;
}

// address book TDD
const testStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    clear() {
        this.data = {};
    }
};

test("initializes with empty contacts if storage is empty", () => {
    testStorage.clear();
    const book = new AddressBook(testStorage);

 expect(book.contacts).toEqual([]);
});

test("loads contacts from localStorage if they exist", () => {
    const savedContacts = [
        { id: 1, name: "Ruth", phone: "0700", email: "r@mail.com" }
    ];

     testStorage.setItem("contacts", JSON.stringify(savedContacts));

     const book = new AddressBook(testStorage);

     expect(book.contacts.length).toBe(1);
    expect(book.contacts[0].name).toBe("Ruth");
 });

 // Contact constructor TDD
test("creates a contact with correct properties", () => {
    const contact = new Contact("Ruth", "0700", "r@mail.com");

    expect(contact.name).toBe("Ruth");
    expect(contact.phone).toBe("0700");
    expect(contact.email).toBe("r@mail.com");
    expect(contact.id).toBeType("number");
});

// Add contacts TDD
test("adds a contact to the address book", () => {
    testStorage.clear();
    const book = new AddressBook(testStorage);
    const contact = new Contact("Ruth", "0700", "r@mail.com");

    book.addContact(contact);

    expect(book.contacts.length).toBe(1);
    expect(book.contacts[0].name).toBe("Ruth");
});