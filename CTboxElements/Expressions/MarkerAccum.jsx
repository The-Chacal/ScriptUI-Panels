//Fonction ajoutant une variable qui s'incrémente à chaque marqueur mis sur le calque des propriétés selectionnées.
//Return = Ø
function MarkerAccum(){
    
    var PropSelected = CTcheckSelectedProperties();
    if( PropSelected.length > 0 )
    {
        for( var i = 0 ; i < PropSelected.length ; i ++ )
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
                
                app.beginUndoGroup( { en: "Adding Mark Accum" , fr: "Ajout d'un MarkerAccum" } );
                
                var PropLayer = CTgetPropParentLayer( PropSelected[i] );
                var MarkAccumSlider = PropLayer.property(5).addProperty("ADBE Slider Control");
                MarkAccumSlider.name = PropSelected[i].name + " - MarkAccumAmp"
                MarkAccumSlider.property(1).setValue( 50 );
                var NewExp = "//----- MarkerAccum -----\
if( thisLayer.marker.numKeys > 0 )\
{\
    var Amp = effect(\"" + MarkAccumSlider.name + "\")(1);\
    var Marker = 0 ;\
    if( time < thisLayer.marker.nearestKey( time ).time )\
    {\
        Marker = thisLayer.marker.nearestKey( time ).index - 1 ;\
    } else {\
        Marker = thisLayer.marker.nearestKey( time ).index ;\
    }\
    var Accum = Marker * Amp ;//You can now add \"Accum\" to whatever you want\
}\n//----------\n" + OldExp ;
                PropSelected[i].expression = NewExp ;

                app.endUndoGroup() ;
            }
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished modifying your expressions" , fr: "   J'ai fini de customiser tes expressions." } );
    }
    
}