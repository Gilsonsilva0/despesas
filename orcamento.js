class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    ValidarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
    
}

//----------------------------------------------------------------------------------

// armazenamento e recuperação das despesas
class Bd {

    constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

    RecuperarDespesas(){

        //Array de despesas
        let Despesas = Array()

        let id = localStorage.getItem('id')

        // recupera todas as despesas cadastradas em LocalStorage
        for(let i = 0; i <= id; i++){

            // Recupera cada despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa == null){
                continue
            }
            // coloca cada despesa no array
            despesa.id = i
            Despesas.push(despesa)
            console.log(despesa)
        }
        return Despesas 
    }
    
    pesquisar(despesa){
    
    let despesasFiltradas = Array()
        despesasFiltradas = this.RecuperarDespesas()

        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano === despesa.ano)
        }

        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes === despesa.mes)
        }

        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia === despesa.dia)
        }

        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo === despesa.tipo)
        }

        //descricao
		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao === despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			console.log("filtro de valor");
			despesasFiltradas = despesasFiltradas.filter(d => d.valor === despesa.valor)
		}

        return despesasFiltradas;
    }

    remover(id){
        localStorage.removeItem(id)
    }
    
}

let bd = new Bd()

//-----------------------------------------------------------------------------------

function cadastrardespesa(){

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value


    let despesa = new Despesa(
        ano,
        mes,
        dia,
        tipo,
        descricao,
        valor,
    )

    if(despesa.ValidarDados()){

        bd.gravar(despesa)

        document.getElementById('modal-title').innerHTML = 'Registro inserido com êxito'
        document.getElementById('div-title').className = 'modal-header text-success'
        document.querySelector('.modal-body').innerHTML = 'O registro foi efetuado com êxito.'
        document.getElementById('modal-button').className = 'btn btn-success'

        $('#gravacao').modal('show')

        document.getElementById('ano').value = ''
        document.getElementById('mes').value = ''
        document.getElementById('dia').value = ''
        document.getElementById('tipo').value = ''
        document.getElementById('descricao').value = ''
        document.getElementById('valor').value = ''
        

    } else{

        document.getElementById('modal-title').innerHTML = 'Falha ao inserir registro'
        document.getElementById('div-title').className = 'modal-header text-danger'
        document.querySelector('.modal-body').innerHTML = 'Há campos obrigatórios que necessitam ser preenchidos ou corrigidos.'
        document.getElementById('modal-button').className = 'btn btn-danger' 
        
        $('#gravacao').modal('show')
    }
}


function CarregarDespesa(){

    let despesas = Array()
    despesas = bd.RecuperarDespesas()

    let lista_despesa = document.getElementById('body-table')

    despesas.forEach(function(d){

        //insere uma linha para cada elemento do Array
        let linha = lista_despesa.insertRow()

        //para cada linha, adiciona-se tantas colunas, que começam com índice 0
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor


        let btn = document.createElement("button")
        btn.className = 'btn btn-danger btn-sm'
        btn.innerHTML = 'Remover'
        btn.id = d.id
        btn.onclick= function(){

            $('#remocao').modal('show')

            let confirm = document.getElementById('confirm-button')
            let comeback = document.getElementById('comeback-button')
            comeback.onclick = history.back
            
            confirm.addEventListener('click', function(){
                bd.remover(btn.id)
                window.location.reload()
            })
        }

        linha.insertCell(4).append(btn)



    })
}


function pesquisardespesa() {
        let ano = document.getElementById('ano').value;
        let mes = document.getElementById('mes').value;
        let dia = document.getElementById('dia').value;
        let tipo = document.getElementById('tipo').value;
        let descricao = document.getElementById('descricao').value;
        let valor = document.getElementById('valor').value;
    
        let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    
        // Pesquisar despesas com base nos critérios especificados
        let despesasFiltradas = bd.pesquisar(despesa);
    
        // Limpar tabela antes de exibir resultados
        let listaDespesa = document.getElementById('body-table');
        listaDespesa.innerHTML = '';
    
        // Exibir resultados na tabela
        despesasFiltradas.forEach(function(d) {
            // Insere uma linha para cada elemento do Array
            let linha = listaDespesa.insertRow();
    
            // Para cada linha, adiciona-se tantas colunas, que começam com índice 0
            linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano;
            linha.insertCell(1).innerHTML = d.tipo;
            linha.insertCell(2).innerHTML = d.descricao;
            linha.insertCell(3).innerHTML = d.valor;

        });
}



function calculardespesa() {
    
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    // Pesquisar despesas com base nos critérios especificados
    let despesasFiltradas = bd.pesquisar(despesa);

    // Calcular a soma dos valores das despesas filtradas
    let somaTotal = despesasFiltradas.reduce((total, d) => total + parseFloat(d.valor), 0);

    // Exibir a soma total na página
    document.getElementById('soma-total').innerText = "Soma Total: R$ " + somaTotal.toFixed(2);

    // Limpar tabela antes de exibir resultados
    let listaDespesa = document.getElementById('body-table');
    listaDespesa.innerHTML = '';

    // Exibir resultados na tabela
    despesasFiltradas.forEach(function(d) {
        // Insere uma linha para cada elemento do Array
        let linha = listaDespesa.insertRow();

        // Para cada linha, adiciona-se tantas colunas, que começam com índice 0
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano;
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
    });
}



    



