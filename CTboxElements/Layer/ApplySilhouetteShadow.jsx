//Fonction appliquant les effets nécéssaire à la création de l'ombre basée sur la silhouette d'un personnage. Nécéssite le preset "CharacterShadow_v1..1ffx"
//Return = Ø
function ApplySilhouetteShadow(){
    
    var LayerSelection = CTcheckSelectedLayers ()
    if( LayerSelection.length > 0 )
    {
        while( app.project.activeItem.selectedLayers.length > 0 )
        {
            app.project.activeItem.selectedLayers[0].selected = false ;
        }
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            
            app.beginUndoGroup( { en: "Creation of Shadows" , fr: "Création d'Ombres." } );
            
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
                LayerSelection[i].applyPreset( new File( Folder.appPackage.fsName + "/Scripts/CTboxElements/PseudoEffects/CharacterShadow_v1.1.ffx") );
            } else {
                LayerSelection[i].applyPreset( new File( Folder.appPackage.fsName + "/Scripts/ScriptUI Panels/CTboxElements/PseudoEffects/CharacterShadow_v1.1.ffx") );
            }
            LayerSelection[i].selected = false ;
            if( BottomDetected )
            {
                var PropToModify = LayerSelection[i].property(5).property( "Silhouette Adj." ).property(4) ;
                PropToModify.expression = "effect(\"Layer Lowest Point\")(1) + effect(\"Chara. Shadow v1\")(\"Offset\")"
            }

            app.endUndoGroup();
        
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've applied the shadow on the layers." , fr: "J'ai fini d'appliquer l'ombre sur le(s) calque(s)." } );
    }
    
}
