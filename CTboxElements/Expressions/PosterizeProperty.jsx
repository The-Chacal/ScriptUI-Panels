//Fonction ajoutant l'expression de posterization temporelle sur les propriétés selectionnées.
//Return = Ø
function PosterizeProp(){
    
    var PropSelected = CTcheckSelectedProperties();
    if( PropSelected.length > 0 )
    {
        for( var i = 0 ; i < PropSelected.length ; i++ )
        {
            if( PropSelected[i].propertyType == PropertyType.PROPERTY && PropSelected[i].canSetExpression )
            {
                //Récupération de l'expression existante ou création d'une expression de base.
                if( PropSelected[i].expression == "" )
                {
                    var OldExp = "value" ;
                } else {
                    var OldExp = PropSelected[i].expression ;
                }

                
                app.beginUndoGroup( { en: "Posterising the Property" , fr: "Ajout de la Posterisation" } );
                var PropLayer = CTgetPropParentLayer( PropSelected[i] );
                var SliderExists = false ;
                //Modification de l'expression.
                var NewExp = "//----- PosterizeProp -----\
posterizeTime( 1 / thisComp.frameDuration / effect(\"Posterize - Step\")(1) ) ;\n\n//--------------------\n\n" + OldExp ;
                PropSelected[i].expression = NewExp ;
                //Vérification de l'existence du Slider pour régler la posterisation.
                for( var j = 1 ; j <= PropLayer.property(5).numProperties ; j++ )
                {
                    if( PropLayer.property(5).property(j).name == "Posterize - Step" )
                    {
                        SliderExists = true ;
                    }
                }
                if( !SliderExists )
                {
                    var PosterizeSlider = PropLayer.property(5).addProperty("ADBE Slider Control");
                    PosterizeSlider.name = "Posterize - Step" ;
                    PosterizeSlider.property(1).setValue( 3 ) ;
                }

                app.endUndoGroup() ;
            }
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished adding posterisation to your properties." , fr: "   J'ai fini de posterizer tes expressions." } );
    }
}