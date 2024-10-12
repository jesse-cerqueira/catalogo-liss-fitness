function createList() {
  console.log(dataProducts.length);

  // Executa um loop a partir dos itens que vêm da API via JSON (ou que eu colei manualmente =x)
  dataProducts.forEach(product => {
    //Confere se o item de produto consta como "Em estoque" e não é "Rascunho" no WooCommerce
    if (product.status != "draft" && product.catalog_visibility != "hidden") {
      
      //Manda o nome do produto no console (só para o caso de haver algum erro processando a informação de algum produto específico)
      console.log(product.name);

        //1. Criar elemento de lista
        //2. Criar elemento de imagem
        //3. Criar div de agrupamento das informações de texto
        //4. Criar elemento de título
        //5. Criar elemento para preço à vista (price)
        //6. Criar elemento para preço a prazo (sale_price)
        //7. Criar elemento de link de WhatsApp

        //1. Guardar variável de string de src de imagem(ns)
        //2. Guardar variável de string de título
        //3. Guardar variável de string de preço à vista
        //4. Guardar variável de string de preço a prazo

        //1. Alocar variável de string de src de imagem(ns)
        //2. Alocar variável de string de título
        //3. Alocar variável de string de preço à vista
        //4. Alocar variável de string de preço a prazo
        //5. Alocar variável de string de botão


        //1. Criar elemento de lista
        const listItem = document.createElement("li");

        //2. Criar elemento de imagem
        const listItemImageMain  = document.createElement("img");

        //3. Criar div de agrupamento das informações de texto
        const listItemDivInfo = document.createElement("div");

        //4. Criar elemento de título
        const listItemTitle = document.createElement("h2");

        //5. Criar elemento para preço à vista (price)
        const listItemPriceMain = document.createElement("div");

        //6. Criar elemento para preço a prazo (sale_price)
        const listItemPriceCredit = document.createElement("div");

        //7. Criar elemento de botão de ação primária
        const listItemButtonPrimary = document.createElement("a");


        //1. Guardar variável de string de src de imagem(ns)
        const dataProductImage1 = product.images[0].src;

        //2. Guardar variável de string de título
        const dataProductName = document.createTextNode(product.name);

        //3. Guardar variável de string de preço à vista
        const dataProductPriceMain = document.createTextNode(product.price);

        //4. Guardar variável de string de preço a prazo
        const dataProductPriceCredit = document.createTextNode(product.sale_price);

        //5. Guardar variável de textNode de botão (pode ser global?)
        const dataButtonPrimaryText = document.createTextNode("Pedir ao atendimento");


        //1. Alocar variável de string de src de imagem(ns)
        listItemImageMain.setAttribute("src", dataProductImage1);

        //1. Alocar atributo de lazy loading de imagem(ns)
        listItemImageMain.setAttribute("loading", "lazy");

        //1. Alocar atributo de width nas imagem(ns)
        listItemImageMain.setAttribute("width", "1600");

        //1. Alocar atributo de height nas imagem(ns)
        listItemImageMain.setAttribute("height", "1600");

        //2. Alocar variável de string de título
        listItemTitle.appendChild(dataProductName);

        //3. Alocar variável de string de preço à vista
        listItemPriceMain.appendChild(dataProductPriceMain);

        //4. Alocar variável de string de preço a prazo
        listItemPriceCredit.appendChild(dataProductPriceCredit);

        //5. Alocar variável de string de botão
        listItemButtonPrimary.appendChild(dataButtonPrimaryText);

        //6. Alocar dados de link como atributo no botão
        listItemButtonPrimary.setAttribute("href", "https://api.whatsapp.com/send?phone=5527999498626&text=Tenho%20interesse%20no%20" + product.name + ",%20" + product.permalink);

        //FINALMENTE alocar o elemento de lista à lista || CONSERTAR PORQUE TA PORCAMENTE COMENTADO
        listItem.setAttribute("class", "lista-produto");
        listItem.setAttribute("data-layer-product-name", product.slug);
        listItem.appendChild(listItemImageMain);

        listItemDivInfo.appendChild(listItemTitle);
        listItemDivInfo.appendChild(listItemPriceMain);
        listItemDivInfo.appendChild(listItemPriceCredit);
        listItemDivInfo.appendChild(listItemButtonPrimary);

        listItem.appendChild(listItemDivInfo);

        const uldataProducts = document.querySelector("ul");
        uldataProducts.appendChild(listItem);
      }
  }
)
}