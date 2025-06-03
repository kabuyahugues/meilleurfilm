////// classs //////

class ApiConnect {
    constructor(url, key, category) {
        this.url = url;
        this.key = key;
        this.category = category;
    }

    async connection(){
        try {
            const reponse = await fetch(`https://${this.url}${this.category}?api_key=${this.key}`)
            const data = await reponse.json();
            return data;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async getData(){
        const lien = await this.connection();
        const data = await lien.results;
        console.log(data);
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
}

///// variable ///////

let category = 'airing_today';

let lien = new ApiConnect('api.themoviedb.org/3/tv/','6631e5f1dc96088e0d26b86da29b5b6a',category);

let divWapper = document.querySelector('.wrapper');

let btn = document.querySelector('.buttons');

////// function ///////

async function defaultDisplay() {
  let data = await lien.getData();
  if (divWapper) {
    divWapper.innerHTML =  '';

    for (const element of data) {
      console.log(element);
      // div //
      let divShow = document.createElement('div');
      let h2 = document.createElement('h2');
      let divShowImg = document.createElement('div');
      let img = document.createElement('img');
      let divNote = document.createElement('note');

      // class //
      divShow.classList.add('tv-show');
      divShowImg.classList.add('tv-show__img');
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
};

function displayfilter(idx) {
  lien.setCategory(idx);
  defaultDisplay();
}


///// event ///////

btn.addEventListener('click', (e) =>{
  if (e.target.classList.contains('btn')) {
    let btn = e.target.closest('.btn')
    let index = btn.getAttribute('data-tv')
    console.log(`le resultat de l'index est ${index}`);
    if (index) {
      displayfilter(index);
    }
  }
})

//// function ////

defaultDisplay();
