/*execute autocomplete function when someone writes in the text field*/
function autocomplete(inp) {
  var currentFocus;

  inp.addEventListener("input", function(e) {
    closeAllLists();
    currentFocus = -1;
    if(isValid(this) && this.value){
      autocompleteReq(this.value,onAutoCompliteResp);
    }
  });

  /*close all autocomplete lists in the document*/
  function closeAllLists() {
    var autocompleteItems = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < autocompleteItems.length; i++) {
        autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
    }
  }

  /*execute a function when someone clicks in the document*/
  document.addEventListener("click", function (e) {
    closeAllLists();
  });

   /*check if the input is valid*/
  function isValid(input) {
    if (inputFilter(input.value)) {
      input.oldValue = input.value;
      input.oldSelectionStart = input.selectionStart;
      input.oldSelectionEnd = input.selectionEnd;
    } else if (input.hasOwnProperty("oldValue")) {
      input.value = input.oldValue;
      input.setSelectionRange(input.oldSelectionStart, input.oldSelectionEnd);
      alert("English letter only!");
      return false;
    } else {
      alert("English letter only!");
      input.value = "";
      return false;
    }
    return true;
  } 

  function inputFilter(value) {
    return /^[a-z]*$/i.test(value); 
  } 

  /*execute a function presses a key on the keyboard*/
  inp.addEventListener("keydown", function(e) {
    var autoCompleteList = document.getElementById("autocomplete-list");
    if (autoCompleteList) autoCompleteList = autoCompleteList.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(autoCompleteList);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(autoCompleteList);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (autoCompleteList) autoCompleteList[currentFocus].click();
      }
    }
  });

  /*classify an item from the list as "active"*/
  function addActive(autoCompleteList) {
    if (!autoCompleteList) return false;
    removeActive(autoCompleteList);
    if (currentFocus >= autoCompleteList.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (autoCompleteList.length - 1);
    autoCompleteList[currentFocus].classList.add("autocomplete-active");
  }

  /*remove the "active" class from all autocomplete items*/
  function removeActive(autoCompleteList) {
    for (var i = 0; i < autoCompleteList.length; i++) {
      autoCompleteList[i].classList.remove("autocomplete-active");
    }
  }
  /*api response function */
  function onAutoCompliteResp () {
    createAutoCompliteList(JSON.parse(this.responseText));
  }

  /*create a div element that will contain the items*/
  function createAutoCompliteList (arr) {
    var autoCompliteInput = document.getElementById("locationInput");
    var autoCompleteList = document.createElement("div");
    var autoCompleteItem;

    autoCompleteList.setAttribute("id", "autocomplete-list");
    autoCompleteList.setAttribute("class", "autocomplete-items");
    autoCompliteInput.parentNode.appendChild(autoCompleteList);

    for (i = 0; i < arr.length; i++) {
      autoCompleteItem = document.createElement("div");
      autoCompleteItem.innerHTML = arr[i].LocalizedName;
      autoCompleteItem.innerHTML += "<input type='hidden' id='"+arr[i].Key+"' value='" + arr[i].LocalizedName + "'>";
  
      autoCompleteItem.addEventListener("click", function(e) {
        inp.value = "";
        var currentCity = new cityForecast(this.getElementsByTagName("input")[0].id,this.getElementsByTagName("input")[0].value);
        fiveDayReq(onLocationResp,currentCity);
        closeAllLists();
      });
      autoCompleteList.appendChild(autoCompleteItem);
    }
  } 
}