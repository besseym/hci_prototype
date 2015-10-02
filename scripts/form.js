require(
    [
    ],
    function() {



        $( "#form-search" ).submit(function( event ) {

            var isMatch = false,
                formArray = $( this ).serializeArray();

            jQuery.each( formArray, function( i, field ) {

                if(field.name === "keywords"){

                    switch(field.value){

                        case "design":
                            isMatch = true;
                            break;
                    }
                }
                //console.log(field);
                //console.log( field.name + " " + field.value );
            });

            if(isMatch){
                $('#content-viz').show();
                $('#content-overview').hide();
            }

            console.log(isMatch);

            event.preventDefault();
        });
    }
);