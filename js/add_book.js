//var H2 = document.getElementById("NewBook");// utiliser add button
var TitleData;// utiliser ds search bar function search 
var AuthorData;// utiliser ds search bar function search
var response;// utliser resulat de recherche api reponse
//var favorisBooks = new Set(); //set storé les livres
var maPochListe = document.getElementById("poch-list"); // endroit ou se display les book
var book = {};
var poshListSet = []; //array of saved books
// DECLARATION OF VARIABLES
var BookTitle, AuthorName, i, title, author, description, image, displayAuthor, displayBook, displayTitle, displayId,
    displayDescription, displayImg, id;
var item;

// FUNCTIONS

/******************* Ajouter un livre ********************/
// 1 - When we click on 'Ajouter un livre' the search card appears and the button disappears
// 2 - When we click on 'Annuler' the search card disappears and the button 'Ajouter un livre' appears
$(document).ready(function () {
    $("#add-button").click(function () {
        $("#search-card").show();
        $("#add-button").hide();
    });
    $("#cancel-button").click(function () {
        $("#search-card").hide();
        $("#add-button").show();
    });
});


//This function is intended to fetch a book from Google Book API and display to the user
//It is called from the submit button
//Only the first 10 are shown
function getBook() {

    //Get the <div id='results'> that holds the list
    var results = document.getElementById('results');
    //Cleaning the previous result if any
    if (results.childNodes[0] != undefined) {
        results.removeChild(results.childNodes[0])
    }

    /********************************************/
    //Creating a new card
    const container = document.createElement('section')
    container.setAttribute('class', 'container')
    container.className = "container";
    //Add to the DIV id
    results.appendChild(container)

    //Get the input from the title input field
    const titleInput = document.getElementById('book-title').value
    //Get the input from the authot input field
    const authorInput = document.getElementById('author').value
    //Empty url to be populated
    var url = ""
    //If the user entered a title and an author add it to the url
    if (titleInput != "" && authorInput != "") {
        url = 'https://www.googleapis.com/books/v1/volumes?q=+intitle:' + titleInput + '+inauthor:' + authorInput + '&key=AIzaSyD7RmuNImvSRtkVR094MUEATrqg6Jue79g'
    }

    //Fetch the Google Books API
    fetch(url)
        .then(response => {
            localStorage.setItem('savedBooks', response)// clé resultat recherche
            return response.json()

        })
        .then(data => {
            // Display search results
            document.getElementById('display-results').style.visibility = 'visible';

            //If there is at least one result loop through all of them
            if (data.totalItems > 0) {
                for (i = 0; i < data.totalItems; i++) {

                    const innerCard = document.createElement('div')
                    innerCard.className = "inner-card";

                    const bookDetails = document.createElement('p')
                    bookDetails.className = "book-details";

                    const bookId = document.createElement('p')
                    bookId.className = "book-id";

                    const bookTitle = document.createElement('p')
                    bookTitle.className = "book-title";

                    const bookAuthor = document.createElement('p')
                    bookAuthor.className = "book-author";

                    const img = document.createElement('img')
                    img.className = "book-img";

                    const span = document.createElement('span')
                    span.className = "icon";

                    const bookmark = document.createElement('i')
                    bookmark.setAttribute('class', 'fas fa-bookmark')
                    bookmark.setAttribute('style', 'font-size: 6em; color: #1c938c')


                    /******************************************************************************* */
                    // BOOKMARK ADD A BOOK TO POCH LIST

                    // save book data in innercard section as dataset
                    innerCard.setAttribute("data-book-item", JSON.stringify(data.items[i]));
                    bookmark.addEventListener("click", function () {

                        // recuperer id du livre sur lequel on a cliqué
                        // ---- let clickBook = this.getElementsByClassName('book-id');
                        let bookElt = this.parentElement.parentElement;
                        // get out book data in innercard section that we have saved previously
                        let bookDataAsString = bookElt.dataset.bookItem;
                        let boodDataJson = JSON.parse(bookDataAsString); //  convert our text(or 'string' programmaticaly saying) to json object
                        console.log(boodDataJson);
                        let clickbook = bookElt.querySelector(".book-id").innerText; // retrieve content tag
                        // and as our book id text seems as "Id : TRUE_BOOK_ID", now need TRUE_BOOK_ID
                        // to get it we will split text to extract TRUE_BOOK_ID
                        // so "ID : TRUE_BOOK_ID".split(":") = ["ID "," TRUE_BOOK_ID]
                        let bookId = clickbook.split(":")[1].trim(); // the method trim() remove whitespace at start and end string
                        console.log("====================================================")
                        console.log(bookId)
                        console.log(clickbook)
                        console.log("====================================================")

                        //$(this).append("book-id");
                        //let recupId = onclick
                        // let clickBook = data.items[i].volumeInfo.industryIdentifiers[0].type + data.items[i].volumeInfo.industryIdentifiers[0].identifier

                        //let savedBooks = JSON.parse(localStorage.getItem('savedBooks'));
                        // localStorage.getItem('savedBooks')


                        //  for (let i = 0; i < data.totalItems; i++) {

                        // if (clickbook === data.items[i].volumeInfo.industryIdentifiers[0].type + data.items[i].volumeInfo.industryIdentifiers[0].identifier) {
                        if (bookId === boodDataJson.volumeInfo.industryIdentifiers[0].type + boodDataJson.volumeInfo.industryIdentifiers[0].identifier)
                        {

                            // /!\ Please fill book below by value coming in boodDataJson
                            book = {
                                id: bookId,
                                title: boodDataJson.volumeInfo.title,
                                author: boodDataJson.volumeInfo.authors.join(","),
                                description: boodDataJson.volumeInfo.description?.substring(0, 199) + "..." ?? 'Description : ' + ' Information manquante',
                                image: boodDataJson.volumeInfo.imageLinks.thumbnail ?? '/assets/img/unavailable.png'
                            }

                            /* Pour auteur, titre... recup tout puis ajout dans liste favoris
                            book.id = data.items[i].volumeInfo.industryIdentifiers[0].type + data.items[i].volumeInfo.industryIdentifiers[0].identifier;
                            book.title = data.items[i].volumeInfo.title;
                            book.author = data.items[i].volumeInfo.authors[0];
                            if (data.items[i].volumeInfo.description != undefined) {
                                book.description = 'Description : ' + data.items[i].volumeInfo.description.substring(0, 199) + "...";
                            } else {
                                book.description = 'Description : ' + ' Information manquante';
                            }
                            if (data.items[i].volumeInfo.imageLinks != undefined) {
                                img.setAttribute('src', data.items[i].volumeInfo.imageLinks.smallThumbnail)
                                book.image = data.item[i].volumeInfo.imageLinks[0];
                            } else {
                                book.image.setAttribute('/assets/img/unavailable.png')
                            }*/


                        }
                        // }


                        // SESSION STORAGE
                        if (localStorage.getItem('favorisBooks') == null) { // changer clé : favorisBooks
                            localStorage.setItem('favorisBooks', JSON.stringify([{...book, bookId}]));

                            // CREER LISTE SI NULL AC LOCALSTORAGE
                            //favorisBooks.add(favorisBooks[i].id);

                            displayBookToPochList(book);
                        } else {
                            let currentLocalStorage = JSON.parse(localStorage.getItem('favorisBooks'));
                            console.log(currentLocalStorage);
                            let index = currentLocalStorage.findIndex(x => {
                                console.log(x)
                                return (x.id === book.id);
                            });
                            // Check if a book already exists in the local storage
                            if (index !== -1) { // -1
                                alert('Un livre ne pas peut pas être ajouté 2 fois');
                            } else {
                                // Adding books to local storage
                                currentLocalStorage.push({...book, bookId});
                                displayBookToPochList(book);
                            }
                            localStorage.setItem('favorisBooks', JSON.stringify(currentLocalStorage));// convert
                        }
                        let myBooks = JSON.parse(localStorage.getItem('favorisBooks'));
                    });


                    /*********************************************************************************** */

                    // Recup data puis stockage dans une variable
                    displayTitle = 'Titre : ' + data.items[i].volumeInfo.title;

                    displayId = 'Id : ' + data.items[i].volumeInfo.industryIdentifiers[0].type + data.items[i].volumeInfo.industryIdentifiers[0].identifier;

                    displayAuthor = 'Auteur : ' + data.items[i].volumeInfo.authors[0];

                    // Limit description text to 200 carateres or display a message if description is missing
                    if (data.items[i].volumeInfo.description != undefined) {
                        displayDescription = 'Description : ' + data.items[i].volumeInfo.description.substring(0, 199) + "...";
                    } else {
                        displayDescription = 'Description : ' + ' Information manquante';
                    }

                    //If there is an image thumbnail define it as a logo otherwise display an 'unavailable' picture to replace the missing image
                    if (data.items[i].volumeInfo.imageLinks != undefined) {
                        img.setAttribute('src', data.items[i].volumeInfo.imageLinks.smallThumbnail)
                        displayImg = data.items[i].volumeInfo.imageLinks[0];
                    } else {
                        img.setAttribute('/assets/img/unavailable.png')
                    }

                    bookTitle.innerText = displayTitle
                    bookId.innerText = displayId
                    bookAuthor.innerText = displayAuthor
                    bookDetails.innerText = displayDescription
                    img.innerText = displayImg

                    container.appendChild(innerCard)
                    innerCard.appendChild(span)
                    span.appendChild(bookmark)
                    innerCard.appendChild(bookTitle)
                    innerCard.appendChild(bookId)
                    innerCard.appendChild(bookAuthor)
                    innerCard.appendChild(bookDetails)
                    innerCard.appendChild(img)

                }
                // If no book was found, display a message to the user
            } else {
                const error = document.createElement('p')
                error.setAttribute('class', 'no-book')
                error.innerText = 'Aucun livre n\'a été trouvé! ';
                container.appendChild(error)
            }
        })
}


// Cancel button : hide the 'results' section and empty the inputs
$("#cancel-button").click(function () {
    document.getElementById('display-results').style.visibility = 'hidden';
    document.getElementById('book-title').value = '';
    document.getElementById('author').value = '';
})


// Add books to the poch-list

function displayBookToPochList($book) {


    const resultsContent = document.getElementById('poch-list');
    const resultsDivElt = document.createElement("div");

    const idBook = id;
    resultsDivElt.id = idBook;
    resultsDivElt.className = 'resultsPochList';
    resultsContent.appendChild(resultsDivElt);


    const savedCard = document.createElement('div')
    savedCard.className = "saved-card";


    const savedDetails = document.createElement('p')
    savedDetails.className = "saved-details";

    const savedId = document.createElement('p')
    savedId.className = "saved-id";
    savedId.innerText = $book.id;

    const savedTitle = document.createElement('p')
    savedTitle.className = "saved-title";
    savedTitle.innerText = $book.title;

    const savedAuthor = document.createElement('p')
    savedAuthor.className = "saved-author";
    savedAuthor.innerText = $book.author;

    const savedImg = document.createElement('img')
    savedImg.className = "saved-img";
    savedImg.setAttribute("src", $book.image)

    const span = document.createElement('span')
    span.className = "saved-icon";

    resultsDivElt.appendChild(savedCard)
    savedCard.appendChild(span)
    // span.appendChild(bookmark)
    savedCard.appendChild(savedTitle)
    savedCard.appendChild(savedId)
    savedCard.appendChild(savedAuthor)
    savedCard.appendChild(savedDetails)
    savedCard.appendChild(savedImg)


}

loadPochList();
// Loading pochlist 
function loadPochList() {

    let myPochlist = JSON.parse(localStorage.getItem("favorisBooks"));
    console.log("****************************************************************")
    console.log(myPochlist)
    console.log("****************************************************************")
    myPochlist && myPochlist.forEach(book => {
        displayBookToPochList(book);
    });

}


/***
 function displayBookToPochList(){
  pochListContainer.innerHTML = "";
  for(i = 0; i < poshListSet.length ; i++) {

      pochListContainer.innerHTML += 
      `<div id="containerPL" class="container__result"><p>
      <p><a onclick="deleteBook('${poshListSet[i].id}')"><i class="fas fa-trash-alt"></i></a></p>
      <p><strong>Titre:</strong> ${poshListSet[i].title} </p>
      <p><strong>Id:</strong>${poshListSet[i].id}</p>
      <p>Auteur: ${poshListSet[i].author}</p>
      <p>${poshListSet[i].description}</p>
      <p><img id="img"  src="${poshListSet[i].image}"></p>
      </p></div>`;

      savedBooks.add(poshListSet[i].id);
  }

}


 */


/***
 // Remove books from the poch'list
 function addTrashListner(book, idBook) {

  trashElt.addEventListener('click', function() {

      const elt = document.getElementById(idBook);
      console.log('idbook' + idBook);
      elt.remove();

      let currentLocalStorage = JSON.parse(localStorage.getItem('myBooks'));
      let index = currentLocalStorage.findIndex(x => (x.id == idBook));
      if (index != -1) {
          currentLocalStorage.splice(index, 1);
      }
      localStorage.setItem('myBooks', JSON.stringify(currentLocalStorage));
  })
}
 */


/**
 * Session Storage savedBook function
 * @param obj

 const saveBook = (obj) => {
  let keyObj = obj.identifier;
     for(let i = 0 ; i < sessionStorage.length;i++){
      const key = sessionStorage.key(i);
      if(key === keyObj){
         alert("Vous ne pouvez pas ajouter deux fois le même livre");
      }
  }
  savedBook.push(obj);
  sessionStorage.setItem(obj.identifier, JSON.stringify(obj));
}
 */
/**
 * display the session storage objects

 const displaySavedBook = () => {
  bookList.innerHTML = "";
  document.getElementById("poch-List").innerHTML = "";

  for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      document.getElementById("poch-ist").appendChild(formattingSavedResults(JSON.parse(sessionStorage.getItem(key))));

  }
  const content = $("#content .card");
  for (let i = 0; i < content.length; i += 2) {
      const cardGroupOne = document.createElement("div");
      cardGroupOne.className = "card-deck col-lg-6";
      document.getElementById("poch-ist").appendChild(cardGroupOne);
      if (content[i + 1]) {
          cardGroupOne.appendChild(content[i]);
          cardGroupOne.appendChild(content[i + 1]);
      } else {
          cardGroupOne.appendChild(content[i]);
      }

  }
}

 displaySavedBook();


 // Loading pochlist
 function loadPochList() {

  let myPochlist = JSON.parse(localStorage.getItem("myBooks"));

  myPochlist && myPochlist.forEach(book => {
      displayBookList(book, book.id);
  });

}

 */


/**
 * remove items function
 *

 const removedBook = (key) => {
  sessionStorage.removeItem(key);

}

 */


/***


 function poshList(){
   pochListContainer.innerHTML = "";
   for(i = 0; i < poshListSet.length ; i++) {

       pochListContainer.innerHTML += 
       `<div id="containerPL" class="container__result"><p>
       <p><a onclick="deleteBook('${poshListSet[i].id}')"><i class="fas fa-trash-alt"></i></a></p>
       <p><strong>Titre:</strong> ${poshListSet[i].title} </p>
       <p><strong>Id:</strong>${poshListSet[i].id}</p>
       <p>Auteur: ${poshListSet[i].author}</p>
       <p>${poshListSet[i].description}</p>
       <p><img id="img"  src="${poshListSet[i].image}"></p>
       </p></div>`;

       savedBooks.add(poshListSet[i].id);
   }

}
 */

/***
 function displayBookToPochList() {

  pochListContainer.innerHTML = "";
  for(i = 0; i < poshListSet.length ; i++) {

      pochListContainer.innerHTML += 
      `<div id="containerPL" class="container__result"><p>
      <p><a onclick="deleteBook('${poshListSet[i].id}')"><i class="fas fa-trash-alt"></i></a></p>
      <p><strong>Titre:</strong> ${poshListSet[i].title} </p>
      <p><strong>Id:</strong>${poshListSet[i].id}</p>
      <p>Auteur: ${poshListSet[i].author}</p>
      <p>${poshListSet[i].description}</p>
      <p><img id="img"  src="${poshListSet[i].image}"></p>
      </p></div>`;

      savedBooks.add(poshListSet[i].id);
  }


  
  const resultsContent = document.getElementById('poch-list');
  const resultsContainer = document.createElement('section');
  
 
  resultsContainer.className = "container";
  //Add to the DIV id
  resultsContent.appendChild(resultsContainer)
  const savedCard = document.createElement('div')
  // innerCard.setAttribute('class', 'innerCard')
  // innerCard.setAttribute('style', 'border: 2px solid black; padding: 3em')
 savedCard.className = "saved-card";

  // const p = document.createElement('p')
  // p.setAttribute('class', 'bookDetails')
  const savedDetails = document.createElement('p')
  // bookDetails.setAttribute('class', 'bookDetails')
  savedDetails.className = "saved-details";

  const bookId = document.createElement('p')
  // bookId.setAttribute('class', 'bookId')
  bookId.className = "saved-id";

  const bookTitle = document.createElement('p')
  // bookTitle.setAttribute('class', 'bookTitle')
  bookTitle.className = "saved-title";

  const bookAuthor = document.createElement('p')
  // bookAuthor.setAttribute('class', 'bookAuthor')
  bookAuthor.className = "saved-author";

  const img = document.createElement('img')
  img.className = "saved-img";
  
  const span = document.createElement('span')
  // span.setAttribute('class', 'icon')
  span.className = "trash";
 

}

 */


/***

 function deleteBook(bookid) {
  savedBooks.delete(bookid);
  poshListSet = poshListSet.filter(book => book.id !== bookid);
   
   sessionStorage.setItem('poch-list', JSON.stringify(poshListSet));
   poshList();
   console.log(poshListSet.length);
   console.log(savedBooks.size);
   
 }

 */
 











