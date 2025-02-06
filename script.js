let responseProducts = JSON.parse(sessionStorage.getItem('allProducts'))
let filter = JSON.parse(sessionStorage.getItem('filter'))
let products = []
let productsClean = []
let whatsappNumber = "999498626";
let colorsClean = [];

function filterProducts() {

  const skuList = {
    legging: ['LBO', 'LCA', 'LCL', 'LCO', 'LCZ', 'LDU', 'LEM', 'LFA', 'LLA', 'LLO', 'LMO', 'LRE', 'LSL', 'LTR'],
    short: ['SCL', 'SBO', 'SML', 'SCA', 'SCL', 'SCO', 'SCR', 'SCZ', 'SFA', 'SJE', 'SLY', 'SOR', 'SRE', 'SSA', 'SSM', 'SSN', 'SDU'],
    macacao: ['MAC', 'MAQ'],
    blusa: ['BLU', 'BLO', 'CRO', 'REG', 'RFC', 'RCC', 'BLB']
  }

  if (filter.shortOn) {
    baseTipo = 'short';
  }
  else if (filter.leggingOn) {
    baseTipo = 'legging';
  }
  else if (filter.macacaoOn) {
    baseTipo = 'macacao';
  }
  else {
    baseTipo = 'blusa';
  }

  let listaSelecionada = skuList[baseTipo]

  if (filter.unicoOn) {
    baseTamanho = 'TU'
  } else {
    baseTamanho = 'TP'
  }


  responseProducts.forEach((product) => {
    if (listaSelecionada.includes(product.SKU1) && product.SKU4 == baseTamanho) {
      products.push(product);
    }
  });
  return products
}


// Executa a função de receber os itens da API e salvar como .json e gera uma lista tratada a partir das informações obtidas
function arrangeList() {
  filterProducts()

  let listIteration = []; // Lista que irá guardar todos os nomes únicos de produtos (sem a cor) já processados

  // Gera uma lista "limpa" (productsClean) com os produtos recuperados e tratados
  // Depende de receber os produtos em ordem alfabética para tratar os itens corretamente
  products.forEach((product) => {
    // -> extrair a string de cor do nome do produto,
    product.color_variations = product.NOME
      .split(
        /\b(Animal Print|Compressão e Suplex|Compressão|Dryfit Grid|Dryfit|Jacquard Atol|Jacquard Boreal|Jacquard Canelado|Jacquard Chevry|Jacquard Degradê|Jacquard Felina|Jacquard Isla|Jacquard Ondinha|Jacquard Vulcão|Jacquard Spot|Jacquard Zebra e Trilobal|Jacquard Zebra|Jacquard Zig|Suplex Poliamida|Trilobal|Tule)\b/m
      )
      .pop()
      .trim();

    // -> extrair a string do nome do produto até o nome do tecido, antes de " cor", e gravar a string reusltante na variavel "name"
    let name = product.NOME.split(" " + product.color_variations).shift();

    let variationColor = {
      color_name: product.color_variations,
      color_slug: product.color_variations
        .split(" ")
        .join("-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase(),
      images: product.IMG,
      //slug: product.slug,
      //permalink: product.permalink,
      // 'date_created': product.date_created,
    };

    let productNew = {
      id: product.ID,
      name: name,
      status: product.ESTOQUE,
      price: (product.PREÇO * 0.9090909090909),
      images: product.IMG,
      color_variations: [],
      sku: product.SKU,
      sku1: product.SKU1,
      sku2: product.SKU2,
      sku3: product.SKU3,
      sku4: product.SKU4
      //price_sale: product.price_sale,
      //price_interest: product.price_interest,
      //price_interest_sale: product.price_interest_sale,
      //on_sale: product.on_sale,
      // 'stock_status': product.stock_status,
      //categories: product.categories,
      //attributes: product.attributes,
    };

    // Lista as variações únicas de cor em colorsClean
    // if (colorsClean.indexOf(variationColor.color_name) === -1) {
    //   colorsClean.push(variationColor.color_name)
    // }

    // Caso o nome não exista na lista de iteração, fazer algumas coisas
    if (listIteration.indexOf(name) === -1) {
      // Registrar nome na lista de iteração para as próximas conferências em 'products'
      listIteration.push((name = name));

      productNew.color_variations.push(variationColor);
      productsClean.push(productNew);
    } else {
      productsClean[productsClean.length - 1].color_variations.push(
        variationColor
      );
    }
  });

  function swiperVariationImages(arr) {
    return `
      ${arr.images
        .map((image) => {
          return `
          <div class="swiper-slide" data-slide-for-color="${arr.color_name}">
            <div class="swiper-zoom-container">
              <img src="${image}" width="1600" height="1600" alt="${image.alt}" class="image-product" loading="lazy">
            </div>
          </div>
        `;
        })
        .join("")}
    `;
  }

  function swiperVariations(arr) {
    return `
      ${arr.color_variations
        .map((variation) => {
          return `
          <div class="swiper-slide" data-slide-for-color="${variation.slug
            }">
            <div class="swiper swiper-inner">
              <div class="swiper-wrapper">
                ${swiperVariationImages(variation)}
              </div>
            </div>
          </div>
        `;
        })
        .join("")}
    `;
  }

  function swatchesSize(arr) {
    return `
      <div class="wrapper-swatches-size">
        ${arr.attributes[0].options
        .map((size) => {
          return `<div class="swatch-size">${size}</div>`;
        })
        .join("")}
      </div>
    `;
  }

  function swatchesColor(arr) {
    return `
      <div class="wrapper-swatches-color">
        ${arr.color_variations
        .map((color) => {
          return `<div class="swatch-color ${color.color_slug}"></div>`;
        })
        .join("")}
      </div>
    `;
  }

  function productTemplate(product) {
    return `
      <article id="${product.name}" class="wrapper-product">
        <header>
          <h2 class="h5">${product.name}</h2>
        </header>
        <div class="product-prices">
          <span class="product-price">R$ <span class="product-price-value">${Number(
      product.price
    ).toFixed(2)}</span></span>
          <span class="product-price-details">no PIX, ou até 3× de R$ <span class="product-price-3x-value">${Number(
      (product.price * 1.1) / 3
    ).toFixed(2)}</span></span>
    <p class ="sku" style="display: none">SKU: ${product.sku}</p>
        </div>
        ${product.color_variations ? swatchesColor(product) : ""}
        
        
        <!--  tamanho 
        $
        {
          product.attributes.find((obj) => obj.name === "TAMANHO")
            ? swatchesSize(product)
            : ""
        }
        -->
        
          <div class="wrapper-sliders-swiper">
            <div class="swiper swiper-outer" data-slide-for="${product.name}">
              <div class="swiper-wrapper">
                ${swiperVariations(product)}
                </div>
                </div>
        </div>
        <div class="wrapper-actions">
          <a class="btn btn-md btn-primary btn-buy" href="https://api.whatsapp.com/send?phone=5527${whatsappNumber}&text=Gostaria%20de%20mais%20informações%20sobre%20${product.name
      }%20${product.color_variations[0].color_name
      }" target="blank"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 19.5L3 21L4.5 17.5L3.5 15V10L5 6.5L8.5 3.5L13 2.5L18 5L21 8.5V14L18 18.5L12.5 21L7.5 19.5Z" fill="#25D366"/>
<path d="M22.0026 11.7432C21.8917 17.1495 17.6237 21.4883 12.3749 21.4883C12.3075 21.4883 12.2403 21.4876 12.1733 21.4862L12.1834 21.4864C12.1778 21.4864 12.1713 21.4864 12.1647 21.4864C10.4344 21.4864 8.80586 21.0366 7.3825 20.2441L7.43614 20.2714L2 22.0001L3.77301 16.7726C2.88839 15.3477 2.36287 13.6089 2.36287 11.7434C2.36287 11.7433 2.36287 11.7433 2.36287 11.7432C2.47448 6.33676 6.74272 1.99809 11.9918 1.99809C12.0591 1.99809 12.1263 1.99883 12.1933 2.0002L12.1833 2.00004C12.2403 1.99879 12.3075 1.99805 12.3748 1.99805C17.6237 1.99805 21.8917 6.33684 22.0025 11.7325L22.0026 11.7432ZM12.1834 3.55668C12.138 3.55574 12.0845 3.5552 12.0309 3.5552C7.61777 3.5552 4.02836 7.19895 3.92707 11.7334L3.92688 11.7432C3.92877 13.5577 4.52004 15.2292 5.51346 16.5647L5.50008 16.546L4.46658 19.588L7.63939 18.5795C8.92008 19.4295 10.4833 19.9345 12.1606 19.9345C12.1682 19.9345 12.1758 19.9345 12.1833 19.9345H12.1822C12.2275 19.9354 12.281 19.9359 12.3346 19.9359C16.7478 19.9359 20.3372 16.2922 20.4384 11.7577L20.4386 11.7479C20.3422 7.19953 16.7508 3.55047 12.3344 3.55047C12.2813 3.55047 12.2283 3.55102 12.1754 3.55207L12.1833 3.55195L12.1834 3.55668ZM17.1418 13.9975C17.0809 13.8978 16.9213 13.8385 16.6825 13.7187C16.4437 13.5989 15.2574 13.021 15.0381 12.9416C14.8187 12.8621 14.6568 12.8229 14.4961 13.0602C14.3353 13.2976 13.8748 13.8373 13.7336 13.9963C13.5923 14.1553 13.4534 14.1766 13.2122 14.0568C12.4689 13.7586 11.8282 13.3579 11.2683 12.8626L11.2773 12.8704C10.7584 12.3932 10.3139 11.846 9.95346 11.2396L9.93607 11.2082C9.79595 10.9709 9.92113 10.8404 10.0417 10.7218C10.1623 10.6031 10.2829 10.443 10.4034 10.303C10.4982 10.1884 10.5787 10.0569 10.6395 9.91449L10.6434 9.9043C10.6715 9.84852 10.6879 9.7825 10.6879 9.7125C10.6879 9.62824 10.664 9.54973 10.6229 9.48379L10.6238 9.48543C10.5641 9.3668 10.0818 8.19102 9.882 7.71289C9.68219 7.23477 9.48125 7.31422 9.34117 7.31422C9.2011 7.31422 9.0403 7.29402 8.88185 7.29402C8.6279 7.3002 8.40076 7.41383 8.24049 7.59238L8.23996 7.59301C7.72132 8.07746 7.3969 8.77512 7.3969 9.55105C7.3969 9.56301 7.39698 9.57496 7.39713 9.58684V9.585C7.48408 10.5332 7.84079 11.3815 8.38601 12.0629L8.38008 12.0552C9.39826 13.6245 10.7924 14.8584 12.4317 15.6352L12.4922 15.6609C14.9393 16.6172 14.9393 16.298 15.3814 16.2541C16.0697 16.1212 16.6452 15.7046 17.0005 15.1289L17.0063 15.1187C17.1105 14.8855 17.1713 14.6127 17.1713 14.3252C17.1713 14.2044 17.1606 14.0861 17.14 13.9714L17.1418 13.9833V13.9975Z" fill="white"/>
</svg>

<div>Comprar com atendente</div></a>
        </div>
      </article>
      `;
  }

  let list = document.getElementById("list-products")
  list.innerHTML = `
      ${productsClean.map(productTemplate).join("")}
    `;
  const swiperInner = new Swiper(".swiper-inner", {
    virtual: {
      enabled: true,
      addSlidesAfter: 1,
      addSlidesBefore: 1,
    },
    direction: "horizontal",
    perSlideOffset: 3,
    nested: true,
    effect: "cards",
    rotate: true,
    perSlideRotate: 90,
    zoom: {
      enabled: true,
      toggle: true,
      minRatio: 1,
      maxRatio: 1,
    },
  });

  const swiperOuter = new Swiper(".swiper-outer", {
    virtual: {
      enabled: true,
      addSlidesAfter: 1,
    },
    direction: "horizontal",
    spaceBetween: 20,
  });
  const artigo = Array.from(document.querySelectorAll("article"));
  artigo.forEach((div) => {
    const SwipeOutElement = div.querySelector(".swiper-outer");
    const SwipeOut = SwipeOutElement ? SwipeOutElement.swiper : null;
    const arrySwatchColor = Array.from(
      div.getElementsByClassName("swatch-color")
    );

    arrySwatchColor.forEach((color) => {
      color.addEventListener("click", function () {
        ind = arrySwatchColor.indexOf(color);
        const colorVar = div.querySelector('.variation-name')
        //            colorVar.innerHTML = product.color_variations[ind].color_name
        SwipeOut.slideTo(ind, 0);

      });
    });
  });
};
arrangeList()
