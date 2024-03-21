let baoTang = [];
let diaDiem = [];
let venSong = [];
let isLiked = JSON.parse(window.localStorage.getItem("isLiked"));
if (isLiked == null) {
    isLiked = [];
}

async function loadMore(id, arrId, container) {
    container.nextElementSibling.textContent = "Dang tai ..."
    const url = "app/api/getpostshome.php"
    const data = {
        id: id,
        arrId: arrId
    }
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    })

    const result = await response.json();
    result.forEach(element => {
        container.innerHTML += `
        <div class="col-lg-4 col-md-6 col-12 px-4 py-4 ">
                <div class="card-custom hover-box-item">
                <div class="card-image mb-2">
                <img src="public/images/${element.photo}" alt="">
                </div>
                <div class="card-content">
                <div class="row">
                <div class="col-2 text-center mt-3">
                    <i class="fa-${(isLiked.includes(element.id)) ? "solid" : "regular"} fa-heart text-danger " onclick="like(this,${element.id})"><span class="d-inline-block ms-1 fw-bold"> ${element.likes}</span></i>
                </div>
                <div class="col-10">
                    <a href="show.php?id=${element.id}"><h5 class="my-2 card-title mb-5"> ${element.title.substring(0, 50)} ${element.title.length > 50 ? "..." : ""}</h5></a>
                    <p class="my-2 card-desc"> ${element.content.substring(0, 100)}...</p>
                    <div class="card-more">
                        ${element.views} Luot xem | ${element.created_at}
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>
        `
        arrId.push(element.id)
    });
    container.nextElementSibling.textContent = "Tai them"
}

loadMore(1, baoTang, document.querySelector('.bao-tang'))
loadMore(2, diaDiem, document.querySelector('.dia-diem'))
loadMore(3, venSong, document.querySelector('.ven-song'))

async function like(target, id) {
    if (!isLiked.includes(id)) {
        const url = "app/api/like.php"
        const data = {
            id: id
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const result = await response.json();
        target.classList.toggle("fa-solid")
        target.querySelector('span').textContent = result.likes;
        target.classList.toggle("fa-regular")
        isLiked.push(id)
        window.localStorage.setItem('isLiked', JSON.stringify(isLiked));
    }

}





const perPage = 6;
let arrId = [];
async function getPostsByCategories(page, isFirst = false) {

    let nameCat = '';
    const posts = document.querySelector('.posts');
    if (!isFirst) {
        nameCat = document.querySelectorAll('.checkcat:checked')
        if (nameCat.length == 0) {
            nameCat = document.querySelectorAll('.checkcat')
        }
    }

    else {
        nameCat = document.querySelectorAll('.checkcat')
    }

    posts.innerHTML = '';

    arrId = [];
    nameCat.forEach(element => {
        arrId.push(element.value)
    });

    if (arrId.length > 0) {

        let url = "app/api/getpostsfilter.php"
        let data = {
            arrId: arrId,
            page: page,
            perPage: perPage
        }
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        let result = await response.json();
        result.forEach(element => {
            posts.innerHTML += `
            <div class="col-lg-4 col-md-6 col-12 px-4 py-4 ">
                <div class="card-custom hover-box-item">
                <div class="card-image mb-2">
                <img src="public/images/${element.photo}" alt="">
                </div>
                <div class="card-content">
                <div class="row">
                <div class="col-2 text-center mt-3">
                    <i class="fa-${(isLiked.includes(element.id)) ? "solid" : "regular"} fa-heart text-danger " onclick="like(this,${element.id})"><span class="d-inline-block ms-1 fw-bold"> ${element.likes}</span></i>
                </div>
                <div class="col-10">
                    <a href="show.php?id=${element.id}"><h5 class="my-2 card-title mb-5"> ${element.title.substring(0, 50)} ${element.title.length > 50 ? "..." : ""}</h5></a>
                    <p class="my-2 card-desc"> ${element.content.substring(0, 100)}...</p>
                    <div class="card-more">
                        ${element.views} Luot xem | ${element.created_at}
                    </div>
                    </div>
                </div>
                    </div>
                 </div>
        </div>
            `
        });
        //paganition
        url = "app/api/total.php"
        data = {
            arrId: arrId,
        }
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        result = await response.json();
        let paganition = `
        <nav aria-label="Page navigation">
        <ul class="pagination">
        `;
        const total = Math.ceil(result.total / perPage)
        console.log(total)
        for (let i = 1; i <= total; i++) {
            paganition += `<li class="page-item ${(i == page ? "active" : "")}" onclick="getPostsByCategories(${i})"><span class="page-link">${i}</span></li>`
        }
        paganition += ` </ul>
        </nav>`
        posts.innerHTML += paganition
    }
}


