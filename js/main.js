////// classs //////

class ApiConnect {
    constructor(url, key, category, favoris) {
        this.url = url;
        this.key = key;
        this.category = category;
        this.number = 1;
        this.favoris = favoris
    }

    async connection(){
        try {
            const reponse = await fetch(`https://${this.url}${this.category}?page=${this.number}&api_key=${this.key}`)
            const data = await reponse.json();
            return data;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async lienSinglePage(id){
        try {
            const reponse = await fetch(`https://${this.url}${id}?api_key=${this.key}`)
            const data = await reponse.json();
            // console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async getData(){
        const lien = await this.connection();
        const data = await lien.results;
        // console.log(data);
        if (data) {
          return data;
        }else{
          console.log('il n a pas de data');
          return;
        }
    }

    setCategory(newCategory) {
        this.category = newCategory;
    } 

    setPage(newPage) {
        this.number = newPage;
    }
    setFavori(newFavoris){
      this.favoris = newFavoris
    }
    getFavori(){

    }
}

///// variable ///////

let category = 'top_rated';

let number = 1;

let arrayFilm = [];

let lien = new ApiConnect('api.themoviedb.org/3/tv/','6631e5f1dc96088e0d26b86da29b5b6a',category, number);

let divWapper = document.querySelector('.wrapper');

let btn = document.querySelector('.buttons');
let btnNext = document.querySelector('.next');
let btnPre = document.querySelector('.pre');

let btnFavoris = document.querySelector('.favoris')

////// function ///////

async function defaultDisplay() {
  let data = await lien.getData();
  if (divWapper) {
    divWapper.innerHTML =  '';

    for (const element of data) {
      // div //
      let divShow = document.createElement('div');
      let h2 = document.createElement('h2');
      let divShowImg = document.createElement('a');
      let img = document.createElement('img');
      let divNote = document.createElement('note');
      let divcheck = document.createElement('div');

      // class //
      divShow.classList.add('tv-show');
      divShowImg.classList.add('tv-show__img');
      divShowImg.href = `detail.html?id=${element.id}`
      divNote.classList.add('note');
      divcheck.classList.add('check');

      // insert //
      h2.textContent = element.name;
      img.src = `https://image.tmdb.org/t/p/w500/${element.poster_path}`;
      divNote.textContent = `${element.vote_average}/10`

      // append //
      divShow.append(h2, divShowImg, divcheck);
      divShowImg.append(img, divNote);
      divWapper.appendChild(divShow);

      if (divcheck) {
        divcheck.addEventListener('click', (e) => {
          divcheck.classList.add('bleu');
          arrayFilm.push(element);
          localStorage.setItem("favoritFilm", JSON.stringify(arrayFilm));
          let favoris = localStorage.getItem("favoritFilm");
          let json = JSON.parse(favoris);
          console.log(json);
          
          lien.setFavori(json);
        })
      }
    }

  }
};

function pagination() {
   if (btnPre && btnNext) {
      btnNext.addEventListener('click', (e) =>{
        console.log(lien);
        
        number ++
        lien.setPage(number);
        defaultDisplay();
      });
      btnPre.addEventListener('click', () => {
          if (number > 1) {
            number--;
            lien.setPage(number);
            defaultDisplay();
          }
      });
    }
}

function displayfilter(idx) {
  lien.setCategory(idx);
  defaultDisplay();
}

async function displayShowDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  let data = await lien.lienSinglePage(id)  
  
  let h3 = document.querySelector('.single_titlte')
  let p = document.querySelector('.text')
  let img = document.querySelector('.imgaSingle')

  
  h3.textContent = data.name;
  p.textContent = data.overview;
  img.src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
}

function favoris() {
  
  const favoris = localStorage.getItem("favoritFilm");
  if (favoris) {
    const json = JSON.parse(favoris);
    lien.setFavori(json);
    divWapper.innerHTML =  '';

    for (const element of json) {
      // div //
      let divShow = document.createElement('div');
      let h2 = document.createElement('h2');
      let divShowImg = document.createElement('a');
      let img = document.createElement('img');
      let divNote = document.createElement('note');
      let divcheck = document.createElement('div');

      // class //
      divShow.classList.add('tv-show');
      divShowImg.classList.add('tv-show__img');
      divShowImg.href = `detail.html?id=${element.id}`
      divNote.classList.add('note');

      // insert //
      h2.textContent = element.name;
      img.src = `https://image.tmdb.org/t/p/w500/${element.poster_path}`;
      divNote.textContent = `${element.vote_average}/10`

      // append //
      divShow.append(h2, divShowImg);
      divShowImg.append(img, divNote);
      divWapper.appendChild(divShow);
    }
  }
  
}


///// event ///////

if (btn) {
  btn.addEventListener('click', (e) =>{
  if (e.target.classList.contains('btn')) {
    let btnall = document.querySelectorAll('.btn')
    btnall.forEach(b => b.classList.remove('active'));
    let btn = e.target.closest('.btn')
    btn.classList.add('active')
    let index = btn.getAttribute('data-tv')
    console.log(`le resultat de l'index est ${index}`);
    if (index) {
      displayfilter(index);
    }
  }
  })
}

if (btnFavoris) {
  btnFavoris.addEventListener('click', (e) =>{
  favoris();
  })
}

//// function ////

defaultDisplay();
displayShowDetails();
pagination();
