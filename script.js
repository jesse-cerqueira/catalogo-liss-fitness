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
      }" target="blank"><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 19.5L3.5 21L5 17.5L4 15V10L5.5 6.5L9 3.5L13.5 2.5L18.5 5L21.5 8.5V14L18.5 18.5L13 21L8 19.5Z" fill="#25D366"/>
<path d="M22.5026 11.7432C22.3917 17.1495 18.1237 21.4883 12.8749 21.4883C12.8075 21.4883 12.7403 21.4876 12.6733 21.4862L12.6834 21.4864C12.6778 21.4864 12.6713 21.4864 12.6646 21.4864C10.9344 21.4864 9.30586 21.0366 7.8825 20.2441L7.93614 20.2714L2.5 22.0001L4.27301 16.7726C3.38839 15.3477 2.86287 13.6089 2.86287 11.7434C2.86287 11.7433 2.86287 11.7433 2.86287 11.7432C2.97448 6.33676 7.24272 1.99809 12.4918 1.99809C12.5591 1.99809 12.6263 1.99883 12.6933 2.0002L12.6833 2.00004C12.7403 1.99879 12.8075 1.99805 12.8748 1.99805C18.1237 1.99805 22.3917 6.33684 22.5025 11.7325L22.5026 11.7432ZM12.6834 3.55668C12.638 3.55574 12.5845 3.5552 12.5309 3.5552C8.11777 3.5552 4.52836 7.19895 4.42707 11.7334L4.42688 11.7432C4.42877 13.5577 5.02004 15.2292 6.01346 16.5647L6.00008 16.546L4.96658 19.588L8.13939 18.5795C9.42008 19.4295 10.9833 19.9345 12.6606 19.9345C12.6682 19.9345 12.6758 19.9345 12.6833 19.9345H12.6822C12.7275 19.9354 12.781 19.9359 12.8346 19.9359C17.2478 19.9359 20.8372 16.2922 20.9384 11.7577L20.9386 11.7479C20.8422 7.19953 17.2508 3.55047 12.8344 3.55047C12.7813 3.55047 12.7283 3.55102 12.6754 3.55207L12.6833 3.55195L12.6834 3.55668ZM17.6418 13.9975C17.5809 13.8978 17.4213 13.8385 17.1825 13.7187C16.9437 13.5989 15.7574 13.021 15.5381 12.9416C15.3187 12.8621 15.1568 12.8229 14.9961 13.0602C14.8353 13.2976 14.3748 13.8373 14.2336 13.9963C14.0923 14.1553 13.9534 14.1766 13.7122 14.0568C12.9689 13.7586 12.3282 13.3579 11.7683 12.8626L11.7773 12.8704C11.2584 12.3932 10.8139 11.846 10.4535 11.2396L10.4361 11.2082C10.296 10.9709 10.4211 10.8404 10.5417 10.7218C10.6623 10.6031 10.7829 10.443 10.9034 10.303C10.9982 10.1884 11.0787 10.0569 11.1395 9.91449L11.1434 9.9043C11.1715 9.84852 11.1879 9.7825 11.1879 9.7125C11.1879 9.62824 11.164 9.54973 11.1229 9.48379L11.1238 9.48543C11.0641 9.3668 10.5818 8.19102 10.382 7.71289C10.1822 7.23477 9.98125 7.31422 9.84117 7.31422C9.7011 7.31422 9.5403 7.29402 9.38185 7.29402C9.1279 7.3002 8.90076 7.41383 8.74049 7.59238L8.73996 7.59301C8.22132 8.07746 7.8969 8.77512 7.8969 9.55105C7.8969 9.56301 7.89698 9.57496 7.89713 9.58684V9.585C7.98408 10.5332 8.34079 11.3815 8.88601 12.0629L8.88008 12.0552C9.89826 13.6245 11.2924 14.8584 12.9317 15.6352L12.9922 15.6609C15.4393 16.6172 15.4393 16.298 15.8814 16.2541C16.5697 16.1212 17.1452 15.7046 17.5005 15.1289L17.5063 15.1187C17.6105 14.8855 17.6713 14.6127 17.6713 14.3252C17.6713 14.2044 17.6606 14.0861 17.64 13.9714L17.6418 13.9833V13.9975Z" fill="white"/>
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
