$(document).ready(function () {
 
    window.onload =  function gerarData() {
      $.ajax({
    method:"get",
    dataType:"json",
    url:"database/package-smtp.json",
    success: function(data){
      document.getElementById("email").value = data.username;
      document.getElementById("senha").value = data.password;
      
      if(data.service === "gmail"){
        $("input[name=type][value='gmail']").prop("checked",true);
      }
      else if(data.service === "outlook"){
        $("input[name=type][value='outlook']").prop("checked",true);
      }
      else if(data.service === "yahoo"){
        $("input[name=type][value='yahoo']").prop("checked",true);
      }
      
    }
    })
     
    }  
    })