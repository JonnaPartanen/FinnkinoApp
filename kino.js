
function getTeatteri(){ //onload funktio, tätä kutsutaan bodyssa

    var xmlhttp = new XMLHttpRequest();  //luodaan XMLHttpReguest olio
    xmlhttp.open("GET","http://www.finnkino.fi/xml/TheatreAreas/",true); // urli minkä dataa halutaan saada
    xmlhttp.send(); //lähetetään pyyntö

    xmlhttp.onreadystatechange = function(){ //lisätään hmlhttp muuttujaan onreadystatechange listener. Funktio ajetaan...
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) { //...jos saadaan vastaus
        var xmlDoc  = xmlhttp.responseXML; //saatu vastaus sijoitetaan xmlDoc muuttujaan

        var teatteriNimi = xmlDoc.getElementsByTagName("Name"); //etsitään tagi Name saadusta xmlDoc dokumentista ja sijoitetaan muuttujaan.
        var id = xmlDoc.getElementsByTagName("ID");//tässä haetaan teatterien yksilölliset id:t
        //console.log(teatteriNimi.length);

        for(var i=0; i<teatteriNimi.length; i++){ //käydään läpi kaikki teatterien nimet
            var option = document.createElement("option"); //luodaan option elementti, joka kiekalla
            option.value= id[i].innerHTML; //jokaisen option arvo on oma id
            option.innerText=teatteriNimi[i].innerHTML; // lisätään teatterin nimet listaan
            datalist.appendChild(option); //ja lista/option teattereista lisätään datalist nimiseen select valikkoon.
        
     }
     

  }
}

}

function loadMovies(){ 

    var area=document.getElementById('datalist').value; //haetaan teattereiden id arvot area muuttujaan(ks.edellinen funktio)
    var elem1 = document.getElementById("teksti"); //teksti divi muuttujaan elem1
    console.log(area);

    var d = new Date(); //date objekti
    var n = d.getDate() + "." + (d.getMonth() + 1) + "." +d.getFullYear() ; //päivämäärä muotoa päivä, kuukausi ja vuosi

    var xmlhttp = new XMLHttpRequest(); //ks. edellinen funktio
    xmlhttp.open("GET","http://www.finnkino.fi/xml/Schedule/?area="+area+"&dt=n",true); 
    xmlhttp.send();                                                                   

    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var xmlDoc  = xmlhttp.responseXML;

        var title = xmlDoc.getElementsByTagName("Title");//tällä saadaan leffojen nimet eli Titlet
        var id = xmlDoc.getElementsByTagName("EventID");//tällä saadaan leffojen leffojen event Id:eet
    
        var leffa={}; //leffa olin alustus
        var tmpLeffat=[]; //taulukko tmpLeffat

        document.getElementById('leffalista').innerHTML=""; //tyhjennetään leffat valikko ennenkuin vaihdetaan toinen teatteri tai alue

        
        for(var i=0 ;i<title.length;i++){
            leffa={id:id[i].innerHTML, nimi:title[i].innerHTML}; //leffa olioon id ja leffannimi tiedot
            tmpLeffat[i]=leffa; //jotka sijoitetaan taulukkoon

    }
    
    
        var leffat=[]; //taulukko leffat
        for(var i = 0; i<tmpLeffat.length; i++){
            if (tmpLeffat[i]!=""){ 
            leffat[leffat.length]=tmpLeffat[i];
        }
        
        //parsitaan pois leffat niin että leffoja on jokaista vain yhden kerran. Muuten samoja leffoja oli niin monta listassa kuin niitä sinä
        //päivänä on tulossa/menossa
        for(var j = 0; j<tmpLeffat.length; j++){
            
            if(leffat[leffat.length-1].id == tmpLeffat[j].id){
            
                    leffat[leffat.length-1]= tmpLeffat[j];
                    tmpLeffat[j]="";
                    elokuvat(); //funktion elokuvat kutsu, joka on seuraavana
                    
                }
                
                
            }
            
        }
    
    }
    
// elokuvat funktio, jolla luodaan uusi optio tai alasveto vvalikko mihin tulee tietyn teatterin leffat
function elokuvat(){		

    document.getElementById('leffalista').innerHTML=""; //tyhjennetään leffalista valikko kun uusi alue tai leffateatteri valitaan
    
    for(var i=0; i<leffat.length; i++){
        var option = document.createElement("option");
        
        option.value=leffat[i].id;
        option.innerText=leffat[i].nimi;
        document.getElementById('leffalista').appendChild(option);
        
    
     }
    
    }
     
    }
}



function leffantiedot(){

    var tuloste="";
    var area = document.getElementById('datalist').value; //Teatterin/alueen arvo
    var lista = document.getElementById('leffalista').value; //leffojen arvo 
    var elem1 = document.getElementById("teksti");//teksti elementti mihin leffan tiedot tulee

    //sama kuin edellisessä functiossa, tästä olisi voinut tehdä vain oman funktion ja kutsua sitä tarvittaessa
    var d = new Date();
    var n = d.getDate() + "." + (d.getMonth() + 1) + "." +d.getFullYear() ; 

    //samat kutsut kuin aiemmassa funktiossa 
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://www.finnkino.fi/xml/Schedule/?area="+area+"&dt=n&EventID="+lista,true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var xmlDoc  = xmlhttp.responseXML;

    var elokuvanNimi = xmlDoc.getElementsByTagName("Title"); //elokuvannimi
    var kuva = xmlDoc.getElementsByTagName("EventSmallImagePortrait"); //elokuvan pieni kuva
    var aika = xmlDoc.getElementsByTagName("dttmShowStart"); // elokuvan alkamisaika
    var genre = xmlDoc.getElementsByTagName("Genres"); //elokuvan genre
    var kesto = xmlDoc.getElementsByTagName("LengthInMinutes"); //elokuvan kesto
    var ikaraja = xmlDoc.getElementsByTagName("RatingImageUrl"); //kuva ikärajasta
    
    

    tietoja={};
    var tiedot=[];
    elem1.innerHTML=""; //tyhjennetään elem1 kenttä, kun vaihdetaan elokuvaa
    
    for(var i=0; i<elokuvanNimi.length; i++){
        //tietoja olioon nämä kaikki tiedot
        tietoja={elnim:elokuvanNimi[i].innerHTML, kuva:kuva[i].innerHTML, 
            genre:genre[i].innerHTML, kesto:kesto[i].innerHTML, ikaraja:ikaraja[i].innerHTML, aika:getTime(aika[i].innerHTML)};

            tiedot[i]=tietoja; //ja ne taulukkoon
            tuloste+=tietoja.aika+"<br>"; 

    }
        var elokuva = tiedot[0].elnim;
        genre = tiedot[0].genre;
        kesto = tiedot[0].kesto;
        ikaraja = "<img src ="+tiedot[0].ikaraja+">";
        kuva = "<img src ="+tiedot[0].kuva+">";
        aika = tuloste;
    

    //console.log(elokuva+kuva+aika);
    
    //console.log(tiedot);
    //console.log(tietoja.aika);
    
    }
        //sijoitetaan tiedot teksti elementtiin Ja luodaan oncklick nappula joka kutsuu getInfo funktiota
        elem1.innerHTML="<h2>"+elokuva+"</h2><table><tr><td>"+kuva+"</td><td>Näytösajat tänään: <br>"+aika+"</td><td>Genre: <br>"
                        +genre+"</td><td>kesto:<br>"+kesto+" minuuttia</td><td>suositus: <br>"
                         +ikaraja+"</td></tr></table><button id = infoNappi onClick = +getInfo("+lista+")>Info</button>";
    
    }
    
}

function getInfo(lista){ //nappulaa painamalla lisä infoa leffoista

    var lista = document.getElementById('leffalista').value;
    var elem1 = document.getElementById("teksti");


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://www.finnkino.fi/xml/Events/?eventID="+lista,true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var xmlDoc  = xmlhttp.responseXML;

    var synopsis = xmlDoc.getElementsByTagName("Synopsis");
    var nayttelijat= xmlDoc.getElementsByTagName("Cast");
    var video = xmlDoc.getElementsByTagName("Location");
    var osta = xmlDoc.getElementsByTagName("ShowURL");
    
    
    
    video = video[0].innerHTML;
    
    
        video= "<iframe width=420 height=345 src =https://www.youtube.com/embed/"+video+"></iframe>"; //traileri youtubesta 
        var tuloste2="";
        tuloste2 ="Elokuvan synopsis<br>"+synopsis[0].innerHTML+"<br><br>Näyttelijät: "+nayttelijat[0].innerHTML+"<br>";
    
        tuloste2+="<br>Traileri <br>"+video;
    

    var p=document.createElement('p'); //luodaan p elementti johon tulee tuloste2 tiedot eli lisäinfot leffoista
    p.innerHTML+=tuloste2;
    elem1.appendChild(p); //lisätään teksti elementtiin p elementti
}
}
}

function getTime(aika){ //funktio, jolla saadaan haluttu alkamis aika järkevään muotoon

    var d = new Date(aika);
        var hours=d.getHours(); //tunnit
        var min=d.getMinutes(); //minuutit
        
        if(hours<10){           //jos tunnit on alle 10 niin kellon aika tullee muotoon 09
            hours="0"+hours;
        }
            if(min<10){         //ja jos minuutit on alle 10 niin minuutit tulee muotoon 09 
                min="0"+min;
        } 	
        return hours+":"+min;
}

