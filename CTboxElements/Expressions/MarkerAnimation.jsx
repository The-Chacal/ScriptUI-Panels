//****************************************//
// Marker Animation v1.0
//****************************************//

//Fonction ajoutant une expression bloquant l'animation des propriétés selectionnées à chaque marqueur mis sur le calque.
//Return = Ø
function MarkerAnimation(){
    
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

                app.beginUndoGroup( { en: "Stepping the Animation" , fr: "Modification de l'Expression" } );
                
                var NewExp = "//----- MarkerAnim -----\
if( thisLayer.marker.numKeys > 0 )\
{\
    var MarkerIndex = 1 ;\
    if( time > thisLayer.marker.key( MarkerIndex ).time && time < thisLayer.marker.nearestKey( time ).time )\
    {\
        MarkerIndex = thisLayer.marker.nearestKey( time ).index - 1 ;\
    } 	else {\
        MarkerIndex = thisLayer.marker.nearestKey( time ).index ;\
    }\
    var MarkerTime = thisLayer.marker.key( MarkerIndex ).time ;\
    var Result = valueAtTime(MarkerTime)\
} else {\
    var Result = value ;\
}\
Result //This is your animation evolving only at the timing of the markers.\n//----------\n" + OldExp ;
                PropSelected[i].expression = NewExp ;
                
                app.endUndoGroup() ;
            }
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished modifying your expressions" , fr: "   J'ai fini de customiser tes expressions." } );
    }
    
}