import { listaProdutos } from '/produtos.js'

//-----------------------------------------------------------------

function mostrarProdutos() {
  for (let i of listaProdutos) {
    document.querySelector(".produtos-container-produtos").innerHTML += `
      <a class="produto-link" href="produto.html?produto=${i.id}">
        <div class="produto-container">
          <div class="produto-container-img">
            <img src="${i.img[0]}">
          </div>
          <div id="produtoContainerTitulo" class="produto-container-titulo">${i.pretitulo}</div>
        </div>
      </a>
    `;
  }
}
window.mostrarProdutos = mostrarProdutos;


/*
function dragProdutos() {
  for (let i of listaProdutos) {
    if (i.categoria === `livro`) {
      document.getElementById("livros").innerHTML += `
      <a class="produto-link" href="produto.html?produto=${i.id}">
        <div class="produto-container">
          <div class="produto-container-img">
            <img src="${i.img[0]}">
          </div>
          <div id="produtoContainerTitulo" class="produto-container-titulo">${i.pretitulo}</div>
        </div>
      </a>
      `;
    }
  }
  // Coisas
}
*/


//---------------------------------------
//----------- Search produto ------------

function search() {

  // Get url params
  const url = window.location.search
  const valuesUrl = new URLSearchParams(url)
  let produtoUrl = valuesUrl.get('search')

  // Title
  document.title = `Amazon: ${produtoUrl}`;

  // Input
  document.getElementById(`search`).value = `${produtoUrl}`

  if(produtoUrl) {

    const search = produtoUrl.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let produtosSearch = [];

    for (let i of listaProdutos) {

      // check titulo, marca, categoria Strings
      let titulo = i.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(search)
      let marca = i.marca.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(search)
      let categoria = i.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(search)

      if(titulo || marca || categoria) produtosSearch.push(i);
    }

    if(produtosSearch.length > 0) {
      for (let p of produtosSearch) {
        // stringify preco
        const produtoPreco = String(p.preco);
        let produtoPrecoCasa = produtoPreco.slice(0,-2);
        if(produtoPrecoCasa.length > 3) {
          produtoPrecoCasa = `${produtoPrecoCasa.slice(0,-3)}.${produtoPrecoCasa.slice(-3)}`
        }
        let produtoPrecoCentavos = produtoPreco.slice(-2);
        //----------------

        document.getElementById("search-produtos").innerHTML += `
          <a href="produto.html?produto=${p.id}" class="produto-container">
            <img class="produto-img" src="${p.img[0]}" alt="">
            <p class="produto-titulo">${p.titulo}</p>
            <div class="produto-preco"><p>R$</p><p class="preco-casa">${produtoPrecoCasa}</p><p class="preco-centavos">${produtoPrecoCentavos}</p></div>
          </a>
        `;
      }
    }
    else {
      document.getElementById("search-produtos").innerHTML =  `<p>Nada encontrado</p>`
    }
  }
  else {
    location.replace(`amazon.html`);
  }
}
window.search = search;


//---------------------------------------
//----------- Pagina produto ------------

let produtoId, produtoMarca, produtoPreTitulo, produtoTitulo, produtoPreco, produtoImg, produtoImgCart, produtoInfo, produtoSobre, produtoDesc;

function buscaProduto() {
  // Get id from link parameters
  const url = window.location.search
  const valuesUrl = new URLSearchParams(url)
  let produtoUrl = valuesUrl.get('produto')
  // Pesquisa produto
  let verifyProduto = listaProdutos.find(produto => produto.id === produtoUrl);

  if(verifyProduto) {
    for(let produto of listaProdutos) {
      if(produto.id === produtoUrl){
        produtoId = produto.id
        produtoMarca = produto.marca
        produtoPreTitulo = produto.pretitulo
        produtoTitulo = produto.titulo
        produtoPreco = produto.preco
        produtoImg = produto.img
        produtoImgCart = produto.img[0]
        produtoInfo = produto.info
        produtoSobre = produto.sobre
        produtoDesc = produto.desc
      }
    }
    document.body.style.display = `inline`;
  } else {
    location.replace(`amazon.html`);
  }

  document.title = produtoTitulo;
  // Choose img
  const chooseImg = document.getElementById(`chooseImg`)
  let num = 0;
  for(let img of produtoImg) {
    num += 1;
    chooseImg.innerHTML += `<div class="chooseContainerButton"><button><img id="img${num}" src="${img}"></button></div>`
  }
  // Big img
  document.getElementById(`produtoImg`).innerHTML = `<img id="bigImg" src="${produtoImg[0]}">`

  if(produtoImg[0]) {
    document.getElementById("img1").onmouseover = function(){
      document.getElementById("bigImg").src = produtoImg[0];
    };
  }

  if(produtoImg[1]) {
    document.getElementById("img2").onmouseover = function(){
      document.getElementById("bigImg").src = produtoImg[1];
    };
  }

  if(produtoImg[2]) {
    document.getElementById("img3").onmouseover = function(){
      document.getElementById("bigImg").src = produtoImg[2];
    };
  }
  
  // Titulo
  document.getElementById(`infoTitulo`).textContent = produtoTitulo
  // Create div for Preco and Centavos
  let produtoPrecoCasa = produtoPreco.slice(0,-2);
  if(produtoPrecoCasa.length > 3) {
    produtoPrecoCasa = `${produtoPrecoCasa.slice(0,-3)}.${produtoPrecoCasa.slice(-3)}`
  }
  let produtoPrecoCentavos = produtoPreco.slice(-2);
  const divPrecoCentavos = `<div class="preco">${produtoPrecoCasa}</div><div class="centavos">${produtoPrecoCentavos}</div>`
  // Add preco and cents into 'info' div
  const precoContainer1 = document.getElementById(`precoContainer1`)
  precoContainer1.insertAdjacentHTML("beforeend", divPrecoCentavos);
  // Add preco and cents into 'comprar' div
  const precoContainer2 = document.getElementById(`precoContainer2`)
  precoContainer2.insertAdjacentHTML("beforeend", divPrecoCentavos);

  
  document.getElementById(`comprarContainer`).innerHTML += `
  <button id="comprarButton" onclick="comprarItem()" class="comprar-button">Comprar</button>`;

  document.getElementById(`comprarButton`).onclick = function () {
    // Get qtd do produto
    let qtd = document.getElementById(`qtdItem`).value
    //CompraUnicoProduto
    let CompraUnicoItem = [{produtoId, qtd, produtoPreTitulo, produtoPreco, produtoImgCart}];
    localStorage.setItem(`CompraUnicoItem`, JSON.stringify(CompraUnicoItem))
    location.replace(`compraItem.html?item=${produtoId}`);
  }


  if(produtoInfo) {
    document.getElementById(`produto-info`).innerHTML += `
    <table id="tabela" class="tabela">
      <tbody>
        ${produtoInfo}
      </tbody>
		</table>`
  }
  if(produtoSobre) {
    document.getElementById(`produto-info`).innerHTML += `
    <div class="sobre-produto">
      <p>Sobre esse item</p>
      <ul id="itens-sobre" class="itens-sobre">
        ${produtoSobre}
      </ul>
    </div>`
  }
  if(produtoDesc) {
    document.getElementById(`produto-info`).innerHTML += `
    <div id="desc-produto" class="desc-produto">
      <p class="desc-produto-titulo">Descrição</p>
      ${produtoDesc}
    </div>`
  }

}
window.buscaProduto = buscaProduto;


//---------------------------------------
//--------------- CART ------------------

//const localStorageTransactions = JSON.parse(localStorage.getItem(`cart`));
//let transactions = localStorage.getItem(`cartStorage`) !== null ? localStorageTransactions : [];

let cart = [];
let checkCartStorage = localStorage.getItem(`cartStorage`);
if(!checkCartStorage) {
  localStorage.setItem(`cartStorage`, JSON.stringify(cart));
  console.log(`Carrinho criado`)
}
else {
  console.log(`Carrinho encontrado`)
}

function verifyCart() {
  // Get id from link parameters
  const url = window.location.search
  const valuesUrl = new URLSearchParams(url)
  let produtoUrl = valuesUrl.get('produto')

  if (localStorage.cartStorage) {
    cart = JSON.parse(localStorage.getItem(`cartStorage`));
  }

  let verifyOnCart = cart.find(produto => produto.produtoId === produtoUrl);
  if(!verifyOnCart) {
    /*
    document.getElementById(`qtdCart`).innerHTML += `
      <p>Quantidade: </p>
      <select id="qtdItem" class="select-quantidade" name="quantidade">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    `;
    */

    document.getElementById(`addToCartContainer`).innerHTML += `<button id="addToCartButton" class="add-cart-button">Adicionar ao carrinho</button>`

    document.getElementById(`addToCartButton`).onclick = function () {
      let qtd = document.getElementById(`qtdItem`).value
      //Atribui a array cart os valores do cartStorage
      /*
      if (localStorage.cartStorage) {
        cart = JSON.parse(localStorage.getItem(`cartStorage`));
      }
      */
      cart.push({produtoId, qtd, produtoPreTitulo, produtoPreco, produtoImgCart});
      // Atualizar cartStorage
      localStorage.setItem(`cartStorage`, JSON.stringify(cart));
      //console.log(localStorage.getItem(`cartStorage`));
      cartNum()
      location.replace(`cart.html`);
    }
  }
  else {
    document.getElementById(`qtdCart`).innerHTML += `<div class="produto-adicionado">Produto já adicionado ao <a href="cart.html">carrinho</a></div>`;
  }
}
window.verifyCart = verifyCart;

//----------------------------------------

function loadCart() {
  let cartStorage = JSON.parse(localStorage.getItem(`cartStorage`));
  let precoTotal = 0;

  if(cartStorage.length > 0){
    cart = JSON.parse(localStorage.getItem(`cartStorage`));
    //console.log(cart)

    document.getElementById(`produtos-container`).innerHTML = `<div class="produtos-div" id="produtos-div"></div>`

    for(let produto of cart) {
      // Index do produto
      const indexProdutoInCart = cart.indexOf(produto);
      console.log(`index:`,indexProdutoInCart, `-`,produto.produtoPreTitulo, `- Q:`,produto.qtd);

      // Ajustar os precos
      let precoDuro = String(produto.produtoPreco * produto.qtd);
      precoTotal += Number(precoDuro);
      let precoCasa = precoDuro.slice(0,-2);
      if(precoCasa.length > 3) {
        precoCasa = `${precoCasa.slice(0,-3)}.${precoCasa.slice(-3)}`
      }
      let precoCentavos = precoDuro.slice(-2);
      
      document.getElementById(`produtos-div`).innerHTML +=`
        <div id="${indexProdutoInCart}" class="produto">
          <a href="produto.html?produto=${produto.produtoId}" class="p-img">
            <img src="${produto.produtoImgCart}">
          </a>
          <div class="p-info">
            <a href="produto.html?produto=${produto.produtoId}" class="p-info-titulo">${produto.produtoPreTitulo}</a>
            <div style="display: flex; flex-direction: row; align-items: center;">
              <div id="btn-qtd" class="btn-qtd">
                <button id="${indexProdutoInCart}-btn-qtd-less" class="btn-qtd-less" onclick="alterarQtd('-', '${indexProdutoInCart}', '${indexProdutoInCart}-p-info-qtd', '${produto.qtd}', '${indexProdutoInCart}-btn-qtd-less')">-</button>
                <p id="${indexProdutoInCart}-p-info-qtd" class="p-info-qtd">${produto.qtd}</p>
                <button id="${indexProdutoInCart}-btn-qtd-plus" class="btn-qtd-plus" onclick="alterarQtd('+', '${indexProdutoInCart}', '${indexProdutoInCart}-p-info-qtd', '${produto.qtd}', '${indexProdutoInCart}-btn-qtd-plus')">+</button>
              </div>
              <p style="margin-left: 5px;">unidade(s)</p>
              <button id="${indexProdutoInCart}-btn-qtd-ok" class="btn-qtd-ok">Ok</button>
            </div>                          
            <div class="preco-div"><p class="p-info-preco">R$</p><p id="precoValor">${precoCasa},${precoCentavos}</p></div>
          </div>
          <div class="remover-item">
            <button id="remover-button" onclick="removerProdutoCarrinho(${indexProdutoInCart})"><img src="src/delete_1.png"></button>
          </div>
        </div>`;

      if(Number(produto.qtd) === 1) {
        let buttonLess = document.getElementById(`${indexProdutoInCart}-btn-qtd-less`)
        buttonLess.removeAttribute("onclick")
        buttonLess.style.cursor = `default`
        buttonLess.style.opacity = `30%`
        buttonLess.disabled = true
      }
      if(Number(produto.qtd) === 10) {
        let buttonPlus = document.getElementById(`${indexProdutoInCart}-btn-qtd-plus`)
        buttonPlus.removeAttribute("onclick")
        buttonPlus.style.cursor = `default`
        buttonPlus.style.opacity = `30%`
        buttonPlus.disabled = true
      }
        
    }

    document.getElementById(`preco-total`).style.display = `flex`
    //console.log(precoTotal);
    precoTotal = String(precoTotal);
    let precoTotalCasa = precoTotal.slice(0,-2);
    if(precoTotalCasa.length > 3) {
      precoTotalCasa = `${precoTotalCasa.slice(0,-3)}.${precoTotalCasa.slice(-3)}`
    }
    let precoTotalCentavos = precoTotal.slice(-2);
    // Mostrar preco em div
    document.getElementById(`preco-total`).innerHTML = `
        <p class="p-total">Total: R$ ${precoTotalCasa},${precoTotalCentavos}</p>
        <button class="button-finalizar-compra" onclick="finalizarCompra()">Finalizar Compra</button>
        <button class="button-limpar-carrinho" onclick="limparCart()">Limpar Carrinho</button>
    `
    console.log(`Preco Total da compra: ${precoTotalCasa},${precoTotalCentavos}`);
  }
  else {
    document.getElementById(`cartContainer`).innerHTML += `<div class="cart-vazio">Carrinho vazio, <a href="amazon.html">ir às compras</a></div>`;
  }
}
window.loadCart = loadCart;

// Function alterar qtd de produto no carrinho
function alterarQtd(operacao, index, pInfoQtd, qtdP, btnLessPlus) {
  qtdP = Number(qtdP)
  cart = JSON.parse(localStorage.getItem(`cartStorage`));

  if(operacao === `-`) {
    if(qtdP - 1 === 1) {
      let button = document.getElementById(btnLessPlus)
      button.removeAttribute("onclick")
      button.style.cursor = `default`
      button.style.opacity = `30%`
      button.disabled = true

      qtdP -= 1;
      document.getElementById(pInfoQtd).textContent = 1
      
      cart[index].qtd = qtdP
      localStorage.setItem(`cartStorage`, JSON.stringify(cart));
      loadCart()
    }
    else {
      qtdP -= 1;
      cart[index].qtd = qtdP
      localStorage.setItem(`cartStorage`, JSON.stringify(cart));
      loadCart()
    }
    if(Number(cart[index].qtd) === 1) {
      let button = document.getElementById(btnLessPlus)
      button.removeAttribute("onclick")
      button.style.cursor = `default`
      button.style.opacity = `30%`
      button.disabled = true
    }
  }


  if(operacao === `+`) {
    if(qtdP + 1 === 10) {
      let button = document.getElementById(btnLessPlus)
      button.removeAttribute("onclick")
      button.style.cursor = `default`
      button.style.opacity = `30%`
      button.disabled = true
  
      qtdP += 1;
      document.getElementById(pInfoQtd).textContent = 10
      
      cart[index].qtd = qtdP
      localStorage.setItem(`cartStorage`, JSON.stringify(cart));
      loadCart()
    }
    else {
      qtdP += 1;
      cart[index].qtd = qtdP
      localStorage.setItem(`cartStorage`, JSON.stringify(cart));
      loadCart()
    }
    if(Number(cart[index].qtd) === 10) {
      let button = document.getElementById(btnLessPlus)
      button.removeAttribute("onclick")
      button.style.cursor = `default`
      button.style.opacity = `30%`
      button.disabled = true
    }
  } 
}
window.alterarQtd = alterarQtd;

// Function remover produto do carrinho
function removerProdutoCarrinho(indexProdutoInCart) {
  cart.splice(indexProdutoInCart, 1);
  localStorage.setItem(`cartStorage`, JSON.stringify(cart));
  location.reload()
}
window.removerProdutoCarrinho = removerProdutoCarrinho;

function limparCart() {
  cart = []
  localStorage.setItem(`cartStorage`, JSON.stringify(cart))
  location.reload()
}
window.limparCart = limparCart;


//-----------------------------------------------
// Compra

let compra = [];
let checkCompra = localStorage.getItem(`compra`);
if(!checkCompra) {
  localStorage.setItem(`compra`, JSON.stringify(compra));
  console.log(`Compra criada`)
}
else {
  compra = JSON.parse(localStorage.getItem(`compra`))
  //console.log(`Compra: `, compra)
}

function finalizarCompra() {
  let cartStorage = JSON.parse(localStorage.getItem(`cartStorage`))
  compra = cartStorage
  localStorage.setItem(`compra`, JSON.stringify(compra))
  location.replace(`compraCarrinho.html`);
}
window.finalizarCompra = finalizarCompra;

//-------

function compraCarrinho() {
  compra = JSON.parse(localStorage.getItem(`compra`))

  let precoItens = 0;
  let precoItensCasa, precoItensCentavos;
  const freteManuseio = 1590;
  let freteManuseioCasa, freteManuseioCentavos;
  let precoTotal = 0;
  let precoTotalCasa, precoTotalCentavos;

  if(compra.length > 0) {
    for(let produto of compra) {
      
      precoItens += Number(produto.produtoPreco * produto.qtd)

      let produtoPrecoCasa, produtoPrecoCentavos;
      const precoProduto = stringifyPreco(produto.produtoPreco * produto.qtd);

      function stringifyPreco(produtoPreco) {
        produtoPreco = String(produtoPreco);
        produtoPrecoCasa = produtoPreco.slice(0,-2);
        if(produtoPrecoCasa.length > 3) {
          produtoPrecoCasa = `${produtoPrecoCasa.slice(0,-3)}.${produtoPrecoCasa.slice(-3)}`
        }
        produtoPrecoCentavos = produtoPreco.slice(-2);

        return produtoPrecoCasa, produtoPrecoCentavos
      }

      document.getElementById(`revisar-envio-itens-produtos`).innerHTML += `
        <div class="produto">
          <div class="produto-img">
            <img src="${produto.produtoImgCart}" alt="">
          </div>
          <div class="produto-info">
            <p id="produto-nome">${produto.produtoPreTitulo}</p>
            <div id="produto-preco"><p id="preco">R$ ${produtoPrecoCasa},</p><p id="centavos">${produtoPrecoCentavos}</p></div>
            <div id="produto-qtd"><p id="produto-qtd-info">${produto.qtd}</p><p>unidade(s)</p></div>
          </div>
        </div>`
    }

    //-- Preco Itens
    precoItens = String(precoItens);
    precoItensCasa = precoItens.slice(0,-2);
    if(precoItensCasa.length > 3) {
      precoItensCasa = `${precoItensCasa.slice(0,-3)}.${precoItensCasa.slice(-3)}`
    }
    precoItensCentavos = precoItens.slice(-2);
    //-- Preco Total
    precoTotal = Number(precoItens) + freteManuseio;
    precoTotalCasa = String(precoTotal).slice(0,-2);
    if(precoTotalCasa.length > 3) {
      precoTotalCasa = `${precoTotalCasa.slice(0,-3)}.${precoTotalCasa.slice(-3)}`
    }
    precoTotalCentavos = String(precoTotal).slice(-2);
    //-- Frete
    freteManuseioCasa = String(freteManuseio).slice(0,-2)
    freteManuseioCentavos = String(freteManuseio).slice(-2)
    

    document.getElementById(`revisar-envio-finalizar-preco-info-total`).innerHTML += `<p id="preco">R$ ${precoTotalCasa},${precoTotalCentavos}</p>`

    document.getElementById(`items`).innerHTML = `<p>R$ ${precoItensCasa},${precoItensCentavos}</p>`

    document.getElementById(`comprar-container-3-total`).innerHTML += `<p id="comprar-container-3-preco">R$ ${precoTotalCasa},${precoTotalCentavos}</p>`

    // Frete elementos ---------------------------
    document.getElementById(`revisar-envio-itens-frete`).innerHTML += `<p class="frete">R$ ${freteManuseioCasa},${freteManuseioCentavos} Entrega Padrão</p>`

    document.getElementById(`frete-manuseio`).innerHTML = `<p>R$ ${freteManuseioCasa},${freteManuseioCentavos}</p>`
    
    // add button finalizar compra
    document.getElementById(`revisar-envio-div-btn`).innerHTML += `<button class="revisar-envio-btn-finalizar">Finalizar pedido</button>`
    // add button 2 finalizar compra
    const buttonFinalizar2 = document.getElementById(`comprar-container-1`)
    buttonFinalizar2.insertAdjacentHTML("afterbegin", `<button class="btn-finalizar">Finalizar pedido</button>`);

  } else {
    console.log(`vazio`)
    location.replace(`amazon.html`);
  }
  
}
window.compraCarrinho = compraCarrinho;

//-------------------------------------------

function compraUnicoItem() {
  const item = JSON.parse(localStorage.getItem(`CompraUnicoItem`));

  const url = window.location.search
  const valuesUrl = new URLSearchParams(url)
  let itemUrl = valuesUrl.get('item')

  let verifyUrl = item.find(produto => produto.produtoId === itemUrl);
  if(verifyUrl) {
    
    // produtoId, qtd, produtoPreTitulo, produtoPreco, produtoImgCart
    let produtoPrecoCasa, produtoPrecoCentavos, precoTotalCasa, precoTotalCentavos
    const freteManuseio = 1230

    function stringifyPreco(produtoPreco, precoTotal) {
      produtoPreco = String(produtoPreco);
      produtoPrecoCasa = produtoPreco.slice(0,-2);
      if(produtoPrecoCasa.length > 3) {
        produtoPrecoCasa = `${produtoPrecoCasa.slice(0,-3)}.${produtoPrecoCasa.slice(-3)}`
      }
      produtoPrecoCentavos = produtoPreco.slice(-2);

      //------------------

      precoTotal = String(precoTotal);
      precoTotalCasa = precoTotal.slice(0,-2);
      if(precoTotalCasa.length > 3) {
        precoTotalCasa = `${precoTotalCasa.slice(0,-3)}.${precoTotalCasa.slice(-3)}`
      }
      precoTotalCentavos = precoTotal.slice(-2);

      //-----
      return produtoPrecoCasa, produtoPrecoCentavos, precoTotalCasa, precoTotalCentavos
    }

    const produtoPreco = Number(item[0].produtoPreco) * Number(item[0].qtd);
    const precoTotal = (Number(item[0].produtoPreco) * Number(item[0].qtd)) + freteManuseio;
    const preco = stringifyPreco(produtoPreco, precoTotal)

    // Ajustar os preços em precobutro e centavos

    document.getElementById(`revisar-envio-itens-produtos`).innerHTML += `
    <div class="produto">
      <div class="produto-img">
        <img src="${item[0].produtoImgCart}" alt="">
      </div>
      <div class="produto-info">
        <p id="produto-nome">${item[0].produtoPreTitulo}</p>
        <div id="produto-preco"><p id="preco">R$ ${produtoPrecoCasa},</p><p id="centavos">${produtoPrecoCentavos}</p></div>
        <div id="produto-qtd"><p id="produto-qtd-info">${item[0].qtd}</p><p>unidade(s)</p></div>
      </div>
    </div>`


    document.getElementById(`revisar-envio-finalizar-preco-info-total`).innerHTML += `<p id="preco">R$ ${precoTotalCasa},${precoTotalCentavos}</p>`

    document.getElementById(`items`).innerHTML = `<p>R$ ${produtoPrecoCasa},${produtoPrecoCentavos}</p>`

    document.getElementById(`comprar-container-3-total`).innerHTML += `<p id="comprar-container-3-preco">R$ ${precoTotalCasa},${precoTotalCentavos}</p>`


    // Frete elementos ---------------------------
    document.getElementById(`revisar-envio-itens-frete`).innerHTML += `<p class="frete">R$ ${String(freteManuseio).slice(0,2)},${String(freteManuseio).slice(-2)} Entrega Padrão</p>`

    document.getElementById(`frete-manuseio`).innerHTML = `<p>R$ ${String(freteManuseio).slice(0,2)},${String(freteManuseio).slice(-2)}</p>`

    // add button finalizar compra
    document.getElementById(`revisar-envio-div-btn`).innerHTML += `<button class="revisar-envio-btn-finalizar">Finalizar pedido</button>`
    // add button 2 finalizar compra
    const buttonFinalizar2 = document.getElementById(`comprar-container-1`)
    buttonFinalizar2.insertAdjacentHTML("afterbegin", `<button class="btn-finalizar">Finalizar pedido</button>`);
  } else {
    location.replace(`amazon.html`);
  }
}
window.compraUnicoItem = compraUnicoItem;


//-------------------------------------------
//-------------------------------------------
// Numero produtos do carrinho --------------

function cartNum() {
  let cartStorage = JSON.parse(localStorage.getItem(`cartStorage`))
  document.getElementById(`cartNum`).innerHTML = cartStorage.length
}
window.cartNum = cartNum;
