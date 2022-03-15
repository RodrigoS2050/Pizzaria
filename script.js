let modalKey = 0;
let modalQT = 1;
let cart = [];

// Listagem das Pizzas
pizzaJson.map(function(item, index) {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key', index);

    // Adicionando a imagem, preço, nome & descrição das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (event)=>{
        event.preventDefault()
        modalKey = event.target.closest('.pizza-item').getAttribute('data-key')
        modalQT = 1;

	// Preenchendo a tela de informações ao clicar nas pizzas
        document.querySelector('.pizzaBig img').src = item.img;
        document.querySelector('.pizzaInfo h1').innerHTML = item.name;
        document.querySelector('.pizzaInfo--desc').innerHTML = item.description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        document.querySelectorAll('.pizzaInfo--size').forEach(function(size, sizeIndex) {
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = item.sizes[sizeIndex]
        });
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQT

	// Adicionando efeito na janela quando clicar em alguma pizza
        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200); 
    });
    document.querySelector('.pizza-area').append(pizzaItem);
});


// Eventos da janela de compra
function closeWindow() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 500);     
};

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item){
    item.addEventListener('click', closeWindow)
});

document.querySelectorAll('.pizzaInfo--size').forEach(function(size, sizeIndex){
    size.addEventListener('click', ()=>{
       document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
       size.classList.add('selected')
    });
    size.addEventListener('click', ()=>{
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[sizeIndex].toFixed(2)}`
    })
});

// Botões de mais e menos
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQT++
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQT;
})
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQT > 1){
        modalQT--
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQT;
    }
})

// Selecionando os tamanhos das pizzas
document.querySelector('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=> item.identifier == identifier);
    if(key > - 1){
        cart[key].qt += modalQT;
    }else{
        cart.push({
            id: pizzaJson[modalKey].id,
            size,
            price: pizzaJson[modalKey].price[size],
            qt: modalQT,
            identifier
        });
    }
    updateCart();
    closeWindow();
});

// Adicionando evento para abrir e fechar janela de compra no mobile
document.querySelector('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        document.querySelector('aside').style.left = 0
    }
});

document.querySelector('.menu-closer').addEventListener('click', ()=>{
    document.querySelector('aside').style.left = '100vw'
});

// Função para abrir, fechar e atualizar carrinho de compras
function updateCart(){
    document.querySelector('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        document.querySelector('aside').classList.add('show')
        document.querySelector('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find(function(item){
                return item.id == cart[i].id
            });
	    // Calculando Subtotal
            subtotal += cart[i].price * cart[i].qt
	    // Preenchendo as informações das pizzas na janela de compra
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let = pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
	    // Ação de aumentar / diminuir quantidade de pizzas
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            document.querySelector('.cart').append(cartItem)
        };
	// Calculando desconto
        desconto = subtotal * 0.1
	// Calculando total
        total = subtotal - desconto
	// Exibindo valores na finalização da compra
        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else {
        document.querySelector('aside').classList.remove('show')
        document.querySelector('aside').style.left = '100vw';
    } 
};