import { getCategories, getPostsByPage, getPostsByPageAndCategory} from './request.js';
let currentPage = 1;
let currentCategory = "";

const categoriesSelect = document.querySelector(".category-select");
const nextPageButton = document.querySelector(".pagination__next");
const prevPageButton = document.querySelector(".pagination__prev");
const grid = document.querySelector(".grid");
const mask = document.querySelector(".mask");

/*Сохраняем категории в локал стор*/
getCategories()
.then((catrgory) => {
    localStorage.setItem('catrgories', JSON.stringify(catrgory));
})
.then(() =>{
    addCategoriesToSelect();
})
.catch((error) => {
    console.log(error);
});


/*Заполняем категории из локал стора в выпадающий список*/
function addCategoriesToSelect(){
    categoriesSelect.innerHTML = "";
    let option = document.createElement("option");
    option.text = "Выберите категорию";
    option.setAttribute("value","") // Необходимо для "Пустого" выбора.
    categoriesSelect.appendChild(option);
    let categories = JSON.parse(localStorage.getItem('catrgories'));
    categories.forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value",element.id);
        option.text = element.name;
        categoriesSelect.appendChild(option);
    }); 
}

/*Выбор категории из выпадающего списка*/
function chooseCurrentCategory(){
    let categories = JSON.parse(localStorage.getItem('catrgories'));
    currentCategory = categoriesSelect[categoriesSelect.selectedIndex].value;
}
/*Отрисовка постов, при выборе категории*/
categoriesSelect.addEventListener("change",()=>{
    chooseCurrentCategory();
    currentPage=1;
    getRenderedPosts()
})

/*Рендер постов, с учетом страницы и категории*/
 function getRenderedPosts(){
    mask.classList.remove('hide');
    return new Promise((resolve) => {
        if (currentCategory==""){
            getPostsByPage(currentPage)
            .then((pages) => {
                renderPosts(pages);
                mask.classList.add('hide');
                return resolve(1)
            })
        }
        else{
            getPostsByPageAndCategory(currentPage, currentCategory)
            .then((pages) => {
                renderPosts(pages);
                mask.classList.add('hide');
                return  resolve(1)
            })
        }
      });
}

/*Первичная отрисовка постов*/
getRenderedPosts();

/*Функция формирование постов в html структуру*/
function renderPosts(pages){
    grid.innerHTML="";
    pages.forEach(element =>{
        let post = document.createElement('article');
        post.classList.add("article")
        let title = element.title.rendered;
        let category = element.primary_category.name;
        let author = element.parselyMeta["parsely-author"]
        let img = element.parselyMeta["parsely-image-url"];
        const contentString =
        `<img class="article__img" src="${img}"/>
        <div class="article__content">
            <div class="article__title">${title}</div>
            <div class="article__category">Primary category: ${category}</div>
            <div class="article__author">Author: ${author}</div>
        </div>
        ` 
        post.innerHTML = contentString;//element.content.rendered
        grid.appendChild(post);
    })
}


/*Пагинация вперед*/
nextPageButton.addEventListener("click", ()=>{
    currentPage +=1;
    getRenderedPosts()
})

/*Пагинация назад*/
prevPageButton.addEventListener("click", ()=>{
    if(currentPage !=1){
        currentPage-=1;
        getRenderedPosts()
    } 
})