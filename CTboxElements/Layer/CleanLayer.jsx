/*Fonctions permettant de supprimer tout ajout de l'utilisateur sur un calque.*/

//Fonction ouvrant une boite de dialogue permettant de choisir quoi supprimer du calque.
//ChoiceActive = Boolean - Le script montre les choix de nettoyage | endAlert = Boolean - Le script annonce la fin de son execution | UndoGroup = Boolean - Create an undogroup
//Return = Ø
function CleanLayerChoice( ChoiceActive , endAlert , UndoGroup ){
    
    if( ChoiceActive )
    {
        var CleanLayerChoiceDlg = new Window( "palette" , { en : "Choice to Do" , fr: "Choix à Faire" } ) ;
        CleanLayerChoiceDlg.global = CleanLayerChoiceDlg.add( "Group" ) ;
        CleanLayerChoiceDlg.global.preferredSize = [ 200 , -1 ];
        CleanLayerChoiceDlg.global.orientation = "Column" ;
        CleanLayerChoiceDlg.global.alignChildren = "fill" ;
        CleanLayerChoiceDlg.global.spacing = 3 ;
            CleanLayerChoiceDlg.global.Optns = CleanLayerChoiceDlg.global.add( "Panel" , undefined , { en: "Delete : " , fr: "Supprimer : " });
            CleanLayerChoiceDlg.global.Optns.alignChildren = "Left" ;
            CleanLayerChoiceDlg.global.Optns.spacing = 0 ;
                var CleanMarkers = CleanLayerChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - ALL the Markers." , fr: " - TOUTES les Marqueurs." } );
                CleanMarkers.characters = 15 ;
                CleanMarkers.value = false ;
                var CleanProperties = CleanLayerChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - ALL the Animations." , fr: " - TOUTES les Animations." } );
                CleanProperties.characters = 15 ;
                CleanProperties.value = true ;
                var CleanExpressions = CleanLayerChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - ALL the Expressions." , fr: " - TOUTES les Expressions."} );
                CleanExpressions.characters = 15 ;
                CleanExpressions.value = true ;
                var CleanEffects = CleanLayerChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - ALL the Effects." , fr: " - TOUS les Effets."} );
                CleanEffects.characters = 15 ;
                CleanEffects.value = true ;
                var CleanLayerStyles = CleanLayerChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: "All the Layer Styles" , fr: " - TOUS les Styles de Calque." } );
                CleanLayerStyles.characters = 15 ;
                CleanLayerStyles.value = true ;
            var ReinitLayer = CleanLayerChoiceDlg.global.add( "Checkbox" , undefined , { en: " - Reset Layer." , fr: " - RàZ le.s Calque.s."} );
            ReinitLayer.characters = 15 ;
            ReinitLayer.value = false ;
            ReinitLayer.alignment = "Center" ;
            CleanLayerChoiceDlg.global.Btns = CleanLayerChoiceDlg.global.add( "Group" );
            CleanLayerChoiceDlg.global.Btns.alignment = "Center" ;
                var BtnA = CleanLayerChoiceDlg.global.Btns.add( "Button" , undefined , { en: "Clean" , fr: "Nettoyer" } );
                BtnA.size = [ 75 , 25 ];
                var BtnB = CleanLayerChoiceDlg.global.Btns.add( "Button" , undefined , { en: "Cancel" , fr: "Annuler" } );
                BtnB.size = [ 75 , 25 ];

        BtnA.onClick = function () { if( LayerCleaner( CleanMarkers.value , CleanProperties.value , CleanExpressions.value , CleanEffects.value , CleanLayerStyles.value , ReinitLayer.value , endAlert ) ){ CleanLayerChoiceDlg.close(); } };
        BtnB.onClick = function () { CleanLayerChoiceDlg.close() } ;

        CleanLayerChoiceDlg.show()
        CleanLayerChoiceDlg.active = true ;
        CleanLayerChoiceDlg.defaultElement = BtnA ;
    } else {
        LayerCleaner( true , true , true , true , true , false , endAlert , UndoGroup ) ;
    }
    
}

//Fonction qui, en fonction des options choisies supprime les animations, les expressions, les effets et les styles de calques avant de réinitialiser le calque.
//CleanProp = Boolean - le script supprime les clés des property | CleanExp = Boolean - Le script supprime les expression des propriétés | CleanFX = Boolean - Le script supprime les effets du calque | CleanLaySty = Boolean - Le script supprime les styles de calques | Reinit = Boolean - Le script réinitialise le calque | endAlert = Boolean - Annonce la fin | UndoGroup = Boolean - Create an undogroup
//Return = Boolean - A réussi le nettoyage
function LayerCleaner( CleanMark , CleanProp , CleanExp , CleanFX , CleanLaySty , Reinit , endAlert , UndoGroup ){
    var LayerSelection = CTcheckSelectedLayers();
    if( LayerSelection.length > 0 )
    {
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            
            if( UndoGroup )
            {
                app.beginUndoGroup( { en: "Layer Cleaning" , fr: "Nettoyage des Calques"} );
            }

            PropertyCleaner( LayerSelection[i] , CleanMark , CleanProp , CleanExp );
            
            if( CleanFX && LayerSelection[i].property(5).numProperties > 0 )
            {
                while( LayerSelection[i].property(5).numProperties > 0 )
                {
                    LayerSelection[i].property(5).property(1).remove() ;
                }
            }
            if( CleanLaySty && LayerSelection[i].property(5).enabled )
            {
                PropertyCleaner( LayerSelection[i].property(5) , true , true )
                LayerSelection[i].selected = true ;
                app.executeCommand( 3744 ); //Execute la commande "Calques > Styles de Calques > Supprimer Tout".
                
            }
            if( Reinit )
            {
                app.executeCommand( 2605 ); //Execute la commande "Calque > Géométrie > Réinitialiser".
            }
            
            if( UndoGroup )
            {
                app.endUndoGroup();
            }
            
        }

        if( endAlert )
        {
            CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished Cleaning your layers" , fr: "J'ai fini de nettoyer tes Calques." } );
        }
        return true ;
    } else {
        return false ;
    }
    
}

//fonction récursive pour nettoyer chacun des propriétés d'un calque en fonction des options choisies.
//item = object - Property ou PropertyBase à nettoyer | CleanMark = Boolean - le script supprime les marqueurs | CleanProp = Boolean - le script supprime les clés des property | CleanExp = Boolean - Le script supprime les expression des propriétés
//Return = Ø
function PropertyCleaner( item , CleanMark , CleanProp , CleanExp ){
    
    for( var i = 1 ;  i <= item.numProperties ; i++ )
    {   
        if( item.property(i).numProperties != undefined )
        {
            PropertyCleaner( item.property(i) , CleanProp , CleanExp );
        } else {

            if( CleanMark && item.property(i).name == { en: "Marker" , fr: "Marqueur" } && item.property(i).numKeys > 0  )
            {
                while( item.property(i).numKeys > 0 )
                {
                    item.property(i).removeKey(1) ;
                }
            }
            if( CleanProp && item.property(i).name != { en: "Marker" , fr: "Marqueur" } && item.property(i).numKeys > 0  )
            {
                while( item.property(i).numKeys > 0 )
                {
                    item.property(i).removeKey(1) ;
                }
            }
            if( CleanExp && item.property(i).expression != "" )
            {
                item.property(i).expression = "" ;
            }
        }
    }
        
}
