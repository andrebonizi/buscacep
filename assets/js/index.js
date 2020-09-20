$(document).ready(function(){
    var history=[]
    $('#input-cep').autocomplete({
        source: history,
        messages: {
            noResults: 'no results',
            results: (amount) => {
                return amount + 'results.'
            }
        }
    })

    function createMap(mapId, location){
        let options = { zoom: 16, center: location, mapTypeId: google.maps.MapTypeId.ROADMAP };
        let map = new google.maps.Map(document.getElementById(mapId), options);;
        return map
    }

    function createMarker(map, location){
        let marker = new google.maps.Marker({ map: map, draggable: false, })
        marker.setPosition(location);
        return marker
    }

    function getLocation(latitude, longitude){
        let location = new google.maps.LatLng(latitude, longitude);
        return location
    }

    function showAddressOnMap(endereco){
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    let latitude = results[0].geometry.location.lat()
                    let longitude = results[0].geometry.location.lng()
                    let location = getLocation(latitude, longitude)
                    let map = createMap("mapa", location)
                    createMarker( map, location )
                }
            }
        });
    }
    function disableButton(selector){
        $(selector).prop('disabled', true);
        $(selector).addClass('btn-disabled')
    }
    function enableButton(selector){
        $(selector).prop('disabled', false);
        $(selector).removeClass('btn-disabled')
    }

    $('#btn-search').on('click', ()=>{
        let viacep = "https://viacep.com.br/ws/"  
        let cep = $('#input-cep').val().replace(/\D|-/g, '')
        if( history.indexOf(cep)== -1){ history.push( $('#input-cep').val() ) }
        //console.log(history)
        if(cep !== ''){
            $.getJSON( viacep + cep +"/json/?callback=?", (dados)=>{
                if (!("erro" in dados)) {
                    $('#btn-another-search').show()
                    $('.btn-close').show()
                    disableButton('#btn-search')
                    $('#logradouro').html(dados.logradouro)
                    $('#bairro').html(dados.bairro)
                    $('#distrito').html(dados.localidade+' - '+dados.uf)
                    $('#cep').html(dados.cep)
                    let endereco = dados.logradouro + dados.bairro + dados.localidade + ' - ' + dados.uf
                    ///showAddressOnMap(endereco)
                }
                else {
                    alert("CEP não encontrado.");
                }
            }).fail(function() {
                alert( "CEP inválido" );
            });
        }else{
            alert('Insira um CEP')
        }
    })

    $('#btn-another-search').on('click', ()=>{
        enableButton('#btn-search')
        $('#input-cep').val('');
        $('#logradouro').html('')
        $('#bairro').html('')
        $('#distrito').html('')
        $('#cep').html('')
        $('#mapa').html('')
        let id = '#'+this.event.target.id;
        $(id).hide()        
    })
    
    $('.btn-close').on('click', ()=>{
        $('#input-cep').val('');
        $('#logradouro').html('')
        $('#bairro').html('')
        $('#distrito').html('')
        $('#cep').html('')
        $('#mapa').html('')
        $('#btn-another-search').hide()
        let id = '#'+this.event.target.id;
        $(id).hide() 
        
    })
})