//Fonction Ajoutant un paramètre point d'effet animé donnant la position du point le plus bas du calque.
//endAlert = Boolean - la fonction doit elle annoncer la fin de son execution. | UndoGroup = Boolean - Create an undoGroup 
//return = Boolean
function GetLayerBottom( endAlert , UndoGroup ){

    var LayerSelection = CTcheckSelectedLayers() ;
    if( CTcheckSelectedLayers () )
    {
        var Compo = app.project.activeItem ;
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            //Vérification de la présence ou non d'effets. Si il y en a, le script propose d'annuler la recherche pour laisser l'utilisateur désactiver les effets non nécessaires.
            if( LayerSelection[i].property(5).numProperties > 0 )
            {
                var ActiveEffect = false ;
                for( var j = 1 ; j <= LayerSelection[i].property(5).numProperties ; j++ )
                {
                    if( LayerSelection[i].property(5).property(j).active )
                    {
                        ActiveEffect = true ;
                        break ;
                    }
                }
                if( ActiveEffect && !CTchoiceDlg( { en: "So..." , fr: "Alors..."} , { en: "   This action is heavy duty.\n   You should disable your effects that do not alter the position of the animation first.\n\n   Do we continue or do you modify?" , fr: "   Cette action est lourde à éxécuter.\n   Mieux vaut désactiver tes effets non-nécessaires à cette détection d'abord\n\n   On Continue ou tu modifies?" } , { en: "Continue" , fr: "Continuer" } , { en: "Modify" , fr: "Modifier" } ) )
                {
                    return false ;
                }
            }

            if( UndoGroup )
            {
                app.beginUndoGroup( { en: "Lowest Point Detection" , fr: "Detection du point le plus bas." } );
            }

            //Application de l'expression permettant de detecter la position du point le plus bas.
            var LayerBottom = LayerSelection[i].property(5).addProperty( "ADBE Point Control" );
            LayerBottom.name = "Layer Lowest Point";
            LayerBottom = LayerBottom.property(1);
            LayerBottom.expression = "var step = 10 ;\
                var X1 = 0 - step ;\
                var X2 = thisLayer.width + step ;\
                var X = 0 - step ;\
                var Y = thisLayer.height + step ;\
                for( var i = thisLayer.height / step ; i >= 0 ; i-- )\
                {\
                    Y = Y - step ;\
                    var alpha = thisLayer.sampleImage( [ thisLayer.width / 2 , Y ], [thisLayer.width / 2 , 2], true )[3];\
                    if ( alpha != 0 )\
                    {\
                        break;\
                    }\
                }\
                for( i = thisLayer.width / step ; i >= 0 ; i-- )\
                {\
                    X2 = X2 - step ;\
                    var alpha = thisLayer.sampleImage( [ X2 , Y - step / 2 ], [ 2 , step/2 ], true )[3];\
                    if ( alpha != 0 )\
                    {\
                        break;\
                    }\
                }\
                for( i = 0 ; i <= thisLayer.width / step ; i++ )\
                {\
                    X1 = X1 + step ;\
                    var alpha = thisLayer.sampleImage( [ X1 , Y - step / 2 ], [ 2 , step/2 ], true )[3];\
                    if ( alpha != 0 )\
                    {\
                        break;\
                    }\
                }\
                X = ( X1 + X2 ) / 2 ;\
                [ X , Y ]"
            LayerBottom.selected = true;
            app.executeCommand( 2639 ); //Execute la commande "Animation > Assistant d'images clés > Convertion l'expression en images clés".
            LayerBottom.selected = false;
            LayerBottom.expression = "";
            
            if( UndoGroup )
            {
                app.endUndoGroup();
            }
        }
        if( endAlert )
        {
            CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished detecting the lowest point of your layers/" , fr: "J'ai fini de detecter le bas de ton Calque" } );
        }
        return true ;
    }
    
}