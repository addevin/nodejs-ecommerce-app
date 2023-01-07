let toggleBTN = document.getElementById('toggleBTN');
let sbar = document.getElementById('adsidebarForToggle');
var togglesbar = ()=>{
    if(sbar.getAttribute('togglestatus')=='true'){

        sbar.setAttribute('togglestatus','false')
        sbar.classList.remove('sbarActive')
    }else{
        sbar.classList.add('sbarActive')
        sbar.setAttribute('togglestatus','true')

    }
}

(function () {
	'use strict'

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation')

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
})()


function toggleModal(id,togglewut){
    // if(!$('#'+id).hasClass('show')){ 
        // const truck_modal = document.querySelector('#'+id);
        // const modal = bootstrap.Modal.getInstance(truck_modal);    
        if(togglewut=='hide'){
            // modal.hide();
            $("#"+id).modal("hide")
        }else{
            // modal.show();
            $("#"+id).modal("show")

        }
    // }
}