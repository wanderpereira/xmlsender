const fs = require('fs');

      $(document).on('change', '#baixar', function(e){
        if($(this).is(':checked')){
         const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
         data.baixar = true;
        fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
        }else{
         const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
         data.baixar = false;
        fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
        }
      })
      $(document).on('change', '#segmentar', function(e){
        if($(this).is(':checked')){
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.segmentar = true;
           fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           }else{
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.segmentar = false;
           fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           }
      })
      $(document).on('change', '#subpastas', function(e){
        if($(this).is(':checked')){
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.subpastas = true;
           fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           }else{
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.subpastas = false;
           fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           }
      })
      
      $(document).on('change', '#email', function(e){
        if($(this).is(':checked')){
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.email = true;
           fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           }else{
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.email = false;
           fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           }
    })

      
      
      $(document).on('change', '#msmtp', function(e){
        if($(this).is(':checked')){
            // Passa parametro para Listener
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.msmtp = true;
            fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
           
            // Passa parametro falso para Package SMTP
            const res = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
            res.username = ''
            res.password = ''
            res.service = ''
            fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(res, null, 4));
            
            $('em').hide();

           }else{
            // Passa parametro para Listener
            const data = JSON.parse(fs.readFileSync('./sources/database/listener-avancado.json'));
            data.msmtp = false;
            fs.writeFileSync('./sources/database/listener-avancado.json', JSON.stringify(data, null, 4));
            
            // Passa parametro verdadeiro para Package SMTP
            const res = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
            res.username = 'myemail@emailservice.com'
            res.password = 'ashaihsiahsihaisih'
            res.service = 'zig'
            fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(res, null, 4));
            
            $('em').show();
          }
      })

      function fetchdata(){

      $.ajax({
        method:"get",
        dataType:"json",
        url:"database/package-smtp.json",
        success: function(data){
          if(data.service === "gmail"){
            document.getElementById("mailer").innerHTML = "Google";
          }
          if(data.service === "outlook"){
            document.getElementById("mailer").innerHTML = "Microsoft";
          }
          if(data.service === "yahoo"){
            document.getElementById("mailer").innerHTML = "Yahoo";
          }
          if(data.service === "aol"){
            document.getElementById("mailer").innerHTML = "XML Sender (Padrão)";
          }
      
        }
      })
    
      
      $.ajax({
       url: 'database/listener-avancado.json',
       type: 'get',
       dataType: 'json',
       success: function(data){
         if(data.msmtp === true){
          $("a[href$='./smtp.html']").show();
         }else{
          $("a[href$='./smtp.html']").hide();
         }
      }
      });

     }
     
     $(document).ready(function(){
      setInterval(fetchdata,100);
      
     });