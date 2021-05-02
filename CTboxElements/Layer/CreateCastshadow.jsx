//****************************************//
//   Create Cast Shadow v1.0
//****************************************//

//Fonction appliquant les effets nécéssaire à la création de l'ombre basée sur la silhouette d'un personnage. Nécéssite le preset "CastShadow_v1.1.ffx"
//Return = Ø
function CreateCastShadow(){
    
    var LayerSelection = CTcheckSelectedLayers ()
    if( LayerSelection.length > 0 )
    {
        while( app.project.activeItem.selectedLayers.length > 0 )
        {
            app.project.activeItem.selectedLayers[0].selected = false ;
        }
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            
            app.beginUndoGroup( { en : "Creation of cast shadow." , fr: "Création d'ombre au sol."} );
            
            var CastShadowLayer = LayerSelection[i].duplicate();
            CastShadowLayer.name = LayerSelection[i].name + " Shadow";
            CastShadowLayer.moveAfter( LayerSelection[i] );
            CastShadowLayer.blendingMode = BlendingMode.MULTIPLY ;
            if( LayerSelection[i].label + 1 < 17 )
            {
                CastShadowLayer.label = LayerSelection[i].label + 1 ;
            }
            CastShadowLayer.selected = true ;
            CleanLayerChoice( false , false );
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
                LayerSelection[i].applyPreset( new File( Folder.appPackage.fsName + "/Scripts/CTboxElements/PseudoEffects/CastShadow_v1.1.ffx") );
            } else {
                LayerSelection[i].applyPreset( new File( Folder.appPackage.fsName + "/Scripts/ScriptUI Panels/CTboxElements/PseudoEffects/CastShadow_v1.1.ffx") );
            }
            if( BottomDetected )
            {
                var PropToModify = CastShadowLayer.property(5).property( "Cast Shadow v1" ).property(9) ;
                PropToModify.expression = "var Pos = effect(\"Layer Lowest Point\")(1) ;\n[ Pos[0] , Pos[1] ]" ;
            } else {
                CastShadowLayer.property(5).property( "Cast Shadow v1" ).property(9).setValue( [ CastShadowLayer.width / 2 , CastShadowLayer.height * 2 / 3 ] );
            }
            CastShadowLayer.selected = false ;    
            
            app.endUndoGroup();
            
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "   I've created your Cast Shadows." , fr: "J'ai fini de créer ton ombre au sol." } );
    }
    
}