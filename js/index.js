import "../css/styles.scss";
import axios from "axios";
import topbar from "topbar";
import { preloadImage } from "./helpers";

/* VARS */
const form = document.querySelector("form");
const grid = document.querySelector(".cocktailgrid");
const cocktailCardTemplate = document.getElementById("cocktailcard").innerHTML;
const searchInput = document.querySelector("form input");

const likes = getFromLocalStorage();

function saveToLocalStorage(likes) {
  window.localStorage.setItem("likes", JSON.stringify(likes));
}
function getFromLocalStorage() {
  if (window.localStorage.getItem("likes")) {
    return JSON.parse(window.localStorage.getItem("likes"));
  } else {
    return [];
  }
}

/* ON FORM SUBMIT */
form.onsubmit = async (e) => {
  e.preventDefault();
  topbar.show();
  const { drinks } = await getDrinks();
  await render(grid, drinks);
  topbar.hide();
};

/* ON LIKE CLICK */
grid.onclick = (e) => {
  if (e.target.classList.contains("likeBtn")) {
    //als nog niet geliked
    const { id, name, img, status } = e.target.dataset;
    if (status === "liked") {
      //unliken
      likes.splice(
        likes.findIndex((like) => like.id === id),
        1
      );
      e.target.dataset.status = "unliked";
      e.target.querySelector(
        "svg"
      ).innerHTML = `<use href="./icons/icons.svg#icon-heart-unliked" />`;
    } else {
      //liken

      likes.push({
        id,
        name,
        img,
      });
      e.target.dataset.status = "liked";
      e.target.querySelector(
        "svg"
      ).innerHTML = `<use href="./icons/icons.svg#icon-heart-liked" />`;
    }
    saveToLocalStorage(likes);
  }
};

async function render(grid, drinks) {
  grid.innerHTML = "";
  await Promise.all(
    drinks.map(({ strDrinkThumb }) => preloadImage(strDrinkThumb))
  );
  grid.innerHTML = drinks
    .map(({ strDrink, strDrinkThumb, idDrink }) =>
      cocktailCardTemplate
        .replaceAll("%IMG%", strDrinkThumb)
        .replaceAll(
          "%STATUS%",
          likes.find((like) => like.id === idDrink) ? "liked" : "unliked"
        )
        .replace("%ID%", idDrink)
        .replaceAll("%NAME%", strDrink)
    )
    .join("");
}

async function getDrinks() {
  const { data } = await axios(
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" +
      searchInput.value
  );
  return data;
}
