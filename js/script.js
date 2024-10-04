const catBtnSec = document.getElementById('category-btns');
const videoContainer = document.getElementById('videos-container');

let currentVideos = [];

// Category buttons text
const loadCateBtn = async () => {
  const res = await fetch(
    'https://openapi.programming-hero.com/api/phero-tube/categories'
  );
  const data = await res.json();
  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.classList.add(
      'cat-btn',
      'bg-[#dfdfdf]',
      'font-medium',
      'px-3',
      'md:px-5',
      'py-2',
      'rounded-md'
    );

    btn.innerText = cat.category;
    catBtnSec.appendChild(btn);
  });
};

// Active category button
catBtnSec.addEventListener('click', e => {
  const catBtns = document.querySelectorAll('.cat-btn');

  if (e.target.classList.value.includes('cat-btn')) {
    for (let cb of catBtns) {
      cb.classList.remove('bg-[#FF1F3D]', 'text-white');
      cb.classList.add('bg-[#dfdfdf]');
    }

    e.target.classList.remove('bg-[#dfdfdf]');
    e.target.classList.add('bg-[#FF1F3D]', 'text-white');

    filterVideos(e.target.innerText);
  }
});

// Load videos
const loadVideos = async () => {
  try {
    const res = await fetch(
      'https://openapi.programming-hero.com/api/phero-tube/videos'
    );
    if (res.ok) {
      const data = await res.json();

      currentVideos = data.videos;
      makeBanners(currentVideos);
    }
  } catch (err) {
    alert(err.message);
  }
};
// Make videos Banner
const makeBanners = vdArr => {
  vdArr.forEach(vd => {
    const vidDiv = document.createElement('div');
    vidDiv.classList.add('w-full');

    vidDiv.innerHTML = `
        <img class="w-full aspect-video rounded-lg mb-5" src="${
          vd.thumbnail
        } " alt="img">
        <div class="flex gap-3 items-start">
          <img class="w-10 aspect-square rounded-full" src="${
            vd.authors[0].profile_picture
          }" alt="img">
          <div>
            <h5 class="font-bold">${vd.title}</h5>
            <p class="text-sm py-2.5 flex items-center gap-1">${
              vd.authors[0].profile_name
            }${
      vd.authors[0].verified
        ? `
                    <span>
                    <img class="size-5" src="./assets/verified.png" alt="">
                    </span>
                    `
        : ''
    }</p>
            <p class="text-sm">${vd.others.views}</p>
          </div>
        </div>
        `;

    videoContainer.appendChild(vidDiv);
  });
};
// Filter videos
const filterVideos = btnText => {
  videoContainer.innerHTML = '';
  let catVid = [];

  if (btnText === 'All') {
    catVid = currentVideos;
  } else if (btnText === 'Music') {
    const musicVideos = currentVideos.filter(cV => cV.category_id === '1001');

    catVid = musicVideos;
  } else if (btnText === 'Comedy') {
    const comedyVideos = currentVideos.filter(cV => cV.category_id === '1003');

    catVid = comedyVideos;
  } else if (btnText === 'Drawing') {
    const drawingVideos = currentVideos.filter(cV => cV.category_id === '404');

    catVid = drawingVideos;
  }

  if (catVid.length === 0) {
    videoContainer.classList.remove('grid');
    videoContainer.innerHTML = `
  <div class="w-full flex justify-center">
    <img class="w-96 pt-10" src="./assets/Icon.png" alt="img"/>
  </div>
    `;
  } else {
    videoContainer.classList.add('grid');
    makeBanners(catVid);
  }
};

loadCateBtn();
loadVideos();
