//****************************************//
//   Collapse Transformation Manager v1.0
//****************************************//

////////////////////////////////////////////
// Fonctions activant de manière récursive la rasteurisation d'une composition et de ses sous-compositions.
////////////////////////////////////////////

//Fonction activant ou desactivant la rasteurisation et lançant la fonction récursive
//Return = Ø
function CollapseTransformationManager(){

    var LayerSelection = CTcheckSelectedLayers()
    if( LayerSelection.length > 0 )
    {
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            if( LayerSelection[i].source != undefined && LayerSelection[i].source.typeName == "Composition" )
            {
                
                app.beginUndoGroup( { en: "Managing the Collapse option" , fr: "Gestion de la Rasteurisation" });
                
                var Waslocked = LayerSelection[i].locked
                if( Waslocked )
                {
                    LayerSelection[i].locked = false ;
                }
                var CollapseTransformationStatus = !LayerSelection[i].collapseTransformation ;
                LayerSelection[i].collapseTransformation = CollapseTransformationStatus ;
                ChangeCollapseTransformationStatus( LayerSelection[i].source , CollapseTransformationStatus );
                if( Waslocked )
                {
                    LayerSelection[i].locked = true ;
                }
                
                app.endUndoGroup()
                
            }
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished managing the collapse option of your Layers" , fr: "J'ai fini de gérer la rasteurisation de tes Calques." } );
    }
    
}

//Fonction récursive alignant la rasteurisation des sous-compo en fonction de leur composition parent
//item = Object - Composition dans laquelle travailler | Status = Boolean - Etat de la rasteurisation
//Return = Ø
function ChangeCollapseTransformationStatus( item , Status ) {
    
    for( var i = 1 ; i <= item.numLayers ; i++ )
    {
        if( item.layer(i).source != undefined && item.layer(i).source.typeName == "Composition" )
        {
            var Waslocked = item.layer(i).locked ;
            if( Waslocked )
            {
                item.layer(i).locked = false ;
            }
            item.layer(i).collapseTransformation = Status ;
            ChangeCollapseTransformationStatus( item.layer(i).source , Status );
            if( Waslocked )
            {
                item.layer(i).locked = true ;
            }
        }
    }
    
}