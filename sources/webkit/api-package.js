$(document).ready(function () {
 

    window.onload =  function gerarData() {
      $.ajax({
    method:"get",
    dataType:"json",
    url:"database/package-ajustes.json",
    success: function(data){
      document.getElementById("estabelecimento").value = data.estabelecimento;
      document.getElementById("cnpj").value = data.cnpj;
      document.getElementById("email").value = data.email;
      document.getElementById("telefone").value = data.telefone;
      document.getElementById("contab").value = data.contab;
      document.getElementById("caminho").value = data.caminho;
    }
    })
     
    }  
    })