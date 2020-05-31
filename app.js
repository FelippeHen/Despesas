class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados() {
    for(let i in this){
      if(this[i] == undefined || this[i] == '' || this[i == null]){
        return false
      } 
    }
    return true
  }
}

class Bd {
  constructor(){
    let id = localStorage.getItem('id')
     if (id === null){
       localStorage.setItem('id', 0)
     }
  }

  getProximoId(){
    let proximoId = localStorage.getItem('id') 
    return parseInt(proximoId) + 1
  }

  gravar(d) {
    
    let id = this.getProximoId()

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros() {

    //array de despesas
    let despesas = Array()

    let id = localStorage.getItem('id')

    //recuperar todas as despesas cadastradas em local storage
    for(let i = 1; i <= id; i++){

      //recuperar a despesa
      let despesa = JSON.parse(localStorage.getItem(i))

      //verificar se existe a possibilidade de haver indicies que foram pulados ou removidos
      //nesse caso pular os indices.
      if(despesa === null){
        continue 
        // o continue tem a função de dar sequência ao laço de repetição, ignorando tudo que vem abaixo do laço, neste caso, não vai dar o push no array e vai passar para o proximo índice.
      }

      despesa.id = i
      despesas.push(despesa)

    }
    return despesas
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()

    //ano
    if(despesa.ano != ''){
      console.log('filtro de ano')
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //mes
    if (despesa.mes != '') {
      console.log('filtro de mes')
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }
    //dia
    if (despesa.dia != '') {
      console.log('filtro de dia')
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }
    //tipo
    if (despesa.tipo != '') {
      console.log('filtro de tipo')
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    //descricao
    if (despesa.descricao != '') {
      console.log('filtro de descricao')
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    //valor
    if (despesa.valor != '') {
      console.log('filtro de valor')
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }
    return despesasFiltradas
    
  }

  remover(id) {
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

function cadastrarDespesa() {
  
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
    )


  if(despesa.validarDados()) {
      bd.gravar(despesa)
      document.getElementById('DivTitleModal').className = 'modal-header text-success'
      document.getElementById('exampleModalLabel').innerHTML = 'Sucesso na gravação!'
      document.getElementById('bodyModal').innerHTML = 'Dados validados. Despesa cadastrada com sucesso!'
      document.getElementById('btnModal').innerHTML = 'Voltar'
      document.getElementById('btnModal').className = 'btn btn-success'
      //zerar os campos para a inclusão de posterior valor no Local Storage
      ano.value = ''
      mes.value = ''
      dia.value = ''
      tipo.value = ''
      descricao.value = ''
      valor.value = ''
      $('#modalRegistraDespesa').modal('show')
    } else {
      document.getElementById('DivTitleModal').className = 'modal-header text-danger'
      document.getElementById('exampleModalLabel').innerHTML = 'Erro na gravação!'
      document.getElementById('bodyModal').innerHTML = 'Dados inválidos. Todos os campos precisam ser preenchidos!'
      document.getElementById('btnModal').innerHTML = 'Voltar e corrigir'
      document.getElementById('btnModal').className = 'btn btn-danger'
      $('#modalRegistraDespesa').modal('show')
    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {

  if(despesas.length == 0 && filtro == false) {
  despesas = bd.recuperarTodosRegistros()
  }
  
  let listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''

  /*
    <tr>
      <td>04/02/2020</td>
      <td>Lazer</td>
      <td>asdasd</td>
      <td>78966756</td>
    </tr>
  */

  //percorrer o array despesas, listando cada despesa de forma dinâmica.
  //criandos os elementos HTML de forma dinâmica.

  despesas.forEach(function(d) {

    //criando a linha (tr)
    let linha = listaDespesas.insertRow()

    //criar as colunas (td)
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
  
    //ajustar o tipo
    switch(d.tipo){
      case '1': d.tipo = 'Alimentação'
        break
      case '2': d.tipo = 'Educação' 
        break
      case '3': d.tipo = 'Lazer'
        break
      case '4': d.tipo = 'Saúde'
        break
      case '5': d.tipo = 'Transporte'
        break
    }
    linha.insertCell(1).innerHTML = d.tipo

    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //criar o botão de exclusão de itens
    let btn = document.createElement("button")
    btn.className = "btn btn-danger"
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function() { 
      //remover a despesa
      let id = this.id.replace('id_despesa_', '')
      bd.remover(id)
      //window.location.reload()
      document.getElementById('DivTitleModal').className = 'modal-header text-success'
      document.getElementById('exampleModalLabel').innerHTML = 'Despesa Excluída'
      document.getElementById('bodyModal').innerHTML = 'Os dados da despesa foram apagados.'
      document.getElementById('btnModal').innerHTML = 'Voltar'
      document.getElementById('btnModal').className = 'btn btn-success'
      let btnModal = document.getElementById('btnModal')
      btnModal.onclick = function () {
        window.location.reload() 
      }
      $('#modalExcluiDespesa').modal('show')

    }
    linha.insertCell(4).append(btn)
    
  })
}


function pesquisarDespesa() {
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesas = bd.pesquisar(despesa)

  carregaListaDespesas(despesas, true)

}

//Criação gráficos de indicadores de gasto

let tipAli = ['Alimentação', 0]
let tipEdu = ['Educação', 0]
let tipLaz = ['Lazer', 0]
let tipSau = ['Saúde', 0]
let tipTrans = ['Transporte', 0]

let mesJan = ['Janeiro', 0]
let mesFev = ['Fevereiro', 0]
let mesMar = ['Março', 0]
let mesAbr = ['Abril', 0]
let mesMai = ['Maio', 0]
let mesJun = ['Junho', 0]
let mesJul = ['Julho', 0]
let mesAgo = ['Agosto', 0]
let mesSet = ['Setembro', 0]
let mesOut = ['Outubro', 0]
let mesNov = ['Novembro', 0]
let mesDez = ['Dezembro', 0]

function indicarDespesas() {

  let indicadores = Array()
  indicadores = bd.recuperarTodosRegistros()


  indicadores.forEach(function(d){
    parseInt(d.valor)

    switch (d.tipo){
      case '1':
        if(tipAli[1] === 0){
          tipAli[1] = tipAli[1] + parseInt(d.valor)
        } else {
          tipAli[1] += parseInt(d.valor)
        }
        break
      case '2':
        if (tipEdu[1] === 0) {
          tipEdu[1] = tipEdu[1] + parseInt(d.valor)
        } else {
          tipEdu[1] += parseInt(d.valor)
        }
        break
      case '3':
        if (tipLaz[1] === 0) {
          tipLaz[1] = tipLaz[1] + parseInt(d.valor)
        } else {
          tipLaz[1] += parseInt(d.valor)
        }
        break
      case '4':
        if (tipSau[1] === 0) {
          tipSau[1] = tipSau[1] + parseInt(d.valor)
        } else {
          tipSau[1] += parseInt(d.valor)
        }
        break
      case '5':
        if (tipTrans[1] === 0) {
          tipTrans[1] = tipTrans[1] + parseInt(d.valor)
        } else {
          tipTrans[1] += parseInt(d.valor)
        }
        break

  }

  })

  indicadores.forEach(function (d) {
    parseInt(d.mes)

    switch (d.mes) {
      case '1':
        if (mesJan[1] === 0) {
          mesJan[1] = mesJan[1] + parseInt(d.valor)
        } else {
          mesJan[1] += parseInt(d.valor)
        }
        break
      case '2':
        if (mesFev[1] === 0) {
          mesFev[1] = mesFev[1] + parseInt(d.valor)
        } else {
          mesFev[1] += parseInt(d.valor)
        }
        break
      case '3':
        if (mesMar[1] === 0) {
          mesMar[1] = mesMar[1] + parseInt(d.valor)
        } else {
          mesMar[1] += parseInt(d.valor)
        }
        break
      case '4':
        if (mesAbr[1] === 0) {
          mesAbr[1] = mesAbr[1] + parseInt(d.valor)
        } else {
          mesAbr[1] += parseInt(d.valor)
        }
        break
      case '5':
        if (mesMai[1] === 0) {
          mesMai[1] = mesMai[1] + parseInt(d.valor)
        } else {
          mesMai[1] += parseInt(d.valor)
        }
        break
      case '6':
        if (mesJun[1] === 0) {
          mesJun[1] = mesJun[1] + parseInt(d.valor)
        } else {
          mesJun[1] += parseInt(d.valor)
        }
        break
      case '7':
        if (mesJul[1] === 0) {
          mesJul[1] = mesJul[1] + parseInt(d.valor)
        } else {
          mesJul[1] += parseInt(d.valor)
        }
        break
      case '8':
        if (mesAgo[1] === 0) {
          mesAgo[1] = mesAgo[1] + parseInt(d.valor)
        } else {
          mesAgo[1] += parseInt(d.valor)
        }
        break
      case '9':
        if (mesSet[1] === 0) {
          mesSet[1] = mesSet[1] + parseInt(d.valor)
        } else {
          mesSet[1] += parseInt(d.valor)
        }
        break
      case '10':
        if (mesOut[1] === 0) {
          mesOut[1] = mesOut[1] + parseInt(d.valor)
        } else {
          mesOut[1] += parseInt(d.valor)
        }
        break
      case '11':
        if (mesNov[1] === 0) {
          mesNov[1] = mesNov[1] + parseInt(d.valor)
        } else {
          mesNov[1] += parseInt(d.valor)
        }
        break
      case '12':
        if (mesDez[1] === 0) {
          mesDez[1] = mesDez[1] + parseInt(d.valor)
        } else {
          mesDez[1] += parseInt(d.valor)
        }
        break

    }

  })

}



