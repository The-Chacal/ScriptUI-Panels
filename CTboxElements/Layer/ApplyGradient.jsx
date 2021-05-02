//****************************************//
//   Apply Gradient v1.0
//****************************************//

//Fonction appliquant un dégradé en mode incrustation sur le(s) calque(s) selectionné(s). Nécéssite le preset "Gradient_v1.1ffx".
//Return = Ø
function ApplyGradient(){
    
    var LayerSelection = CTcheckSelectedLayers ()
    if( LayerSelection.length > 0 )
    {
        while( app.project.activeItem.selectedLayers.length > 0 )
        {
            app.project.activeItem.selectedLayers[0].selected = false ;
        }
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            
            app.beginUndoGroup( { en: "Apply Gradient." , fr: "Ajout de Dégradé." } );
            
            LayerSelection[i].selected = true ;
            var BottomDetected = false ;
            if( CTchoiceDlg( { en: "So..." , fr: "Alors..." } , { en: "   Do you want me to find the lowest point of your layer \"" + LayerSelection[i].name + "\" ?" , fr: "   Veux-tu que je détermine le point le plus bas de ton calque \"" + LayerSelection[i].name + "\" ?" } ) )
            {
                if( GetLayerBottom( false , false ) )
                {
                    BottomDetected = true ;
                } else {
                    return ;
                }
            }

            var TestFolder = new Folder( Folder.appPackage.fsName + "/Scripts" );
            if( TestFolder.getFiles( "CTboxElements" ).length == 1 )
            {
                LayerSelection[i].applyPreset( new File( Folder.appPackage.fsName + "/Scripts/CTboxElements/PseudoEffects/Gradient_v1.1.ffx") );
            } else {
                LayerSelection[i].applyPreset( new File( Folder.appPackage.fsName + "/Scripts/ScriptUI Panels/CTboxElements/PseudoEffects/Gradient_v1.1.ffx") );
            }
            LayerSelection[i].selected = false ;
            if( BottomDetected )
            {
                var PropToModify = LayerSelection[i].property(5).property( "Gradient Param. v1" ).property(1) ;
                PropToModify.expression = "effect(\"Layer Lowest Point\")(1) + value"
            } else {
                LayerSelection[i].property(5).property( "Gradient Param. v1" ).property(1).setValue( [ LayerSelection[i].width / 2 , LayerSelection[i].height ] ) ;
            }
        
            app.endUndoGroup();
            
        }
            
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've applied the Gradient on your layers." , fr: "J'ai fini de mettre le degradé sur le(s) calque(s)." } );
        
    }
    
}