/*Fonctions permettant d'ajouter des marqueurs sur un calque pour toute clé d'animation détectée dans ses propriétés.*/

//Fonction permettant de choisir si le script doit détecter les clés des effets, des styles ou des transformations.
//Return = Ø
function CreateMarkersForKeysChoice(){
    
    var CreateMarkersForKeysChoiceDlg = new Window( "palette" , { en: "Choice of the properties to analyse" , fr: "Choix des Propriétés à analyser" } );
    CreateMarkersForKeysChoiceDlg.global = CreateMarkersForKeysChoiceDlg.add( "Group" );
    CreateMarkersForKeysChoiceDlg.global.preferredSize = [ 150 , -1 ];
        CreateMarkersForKeysChoiceDlg.global.orientation = "Column" ;
        CreateMarkersForKeysChoiceDlg.global.alignChildren = "fill" ;
            CreateMarkersForKeysChoiceDlg.global.Optns = CreateMarkersForKeysChoiceDlg.global.add( "Panel" , undefined , { en: "Analyse : " , fr: "Analyser : " } );
            CreateMarkersForKeysChoiceDlg.global.Optns.alignChildren = "Left" ;
            CreateMarkersForKeysChoiceDlg.global.Optns.margins = [ 10 , 15 , 10 , 0 ];
                var CheckTransform = CreateMarkersForKeysChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - Transformations." , fr: " - Les Transformations."} );
                CheckTransform.characters = 15 ;
                CheckTransform.value = true ;
                var CheckEffects = CreateMarkersForKeysChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - Effects." , fr: " - Les Effets." } );
                CheckEffects.characters = 15 ;
                CheckEffects.value = true ;
                var CheckLayerStyles = CreateMarkersForKeysChoiceDlg.global.Optns.add( "Checkbox" , undefined , { en: " - Layer Styles." , fr: " - Les Styles de Calque." } );
                CheckLayerStyles.characters = 15 ;
                CheckLayerStyles.value = true ;
            CreateMarkersForKeysChoiceDlg.global.Btns = CreateMarkersForKeysChoiceDlg.global.add( "Group" ) ;
            CreateMarkersForKeysChoiceDlg.global.Btns.alignment = "Center" ;
                var BtnA = CreateMarkersForKeysChoiceDlg.global.Btns.add( "Button" , undefined , { en: "Confirm" , fr: "Valider" } );
                var BtnB = CreateMarkersForKeysChoiceDlg.global.Btns.add( "Button" , undefined , { en: "Cancel" , fr: "Annuler" } );

        BtnA.onClick = function () { if( LayerAnalyser( CheckTransform.value , CheckEffects.value , CheckLayerStyles.value ) ){ CreateMarkersForKeysChoiceDlg.close(); } }
        BtnB.onClick = function () { CreateMarkersForKeysChoiceDlg.close() } ;

        CreateMarkersForKeysChoiceDlg.show()
        CreateMarkersForKeysChoiceDlg.active = true ;
        CreateMarkersForKeysChoiceDlg.defaultElement = BtnA ; 
}

//Fonction analysant les propriétés choisies et ajoutant un marqueur pour chaque clé d'animation trouvée.
//CheckTransform = Boolean - Vérifie les transformations | CheckEffects = Boolean - Vérifie les Effets | CheckLayerStyles = Boolean - Vérifie les Styles de Calques
//Return = Boolean - a réussi.
function LayerAnalyser( CheckTransform , CheckEffects , CheckLayerStyles ){
    
    var LayerSelection = CTcheckSelectedLayers();
    if( LayerSelection.length > 0 )
    {
        for( var z = 0 ; z < LayerSelection.length ; z++ )
        {
            
            app.beginUndoGroup( { en: "Markers Creation" , fr: "Ajout de Marqueurs." } );
            
            var CurrentLayer = LayerSelection[z];
            if( CheckTransform )
            {
                GetKeysTime( CurrentLayer , CurrentLayer.property(6) , 1 );
            }
            if( CheckEffects )
            {
                GetKeysTime( CurrentLayer , CurrentLayer.property(5) , 2 );
            }
            if( CheckLayerStyles )
            {
                GetKeysTime( CurrentLayer , CurrentLayer.property(7) , 3 );
            }
            
            app.endUndoGroup();
            
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished creating Markers on your layers." , fr: "J'ai fini d'ajouter les marqueurs à tes Calques." } );
        return true ;
    } else {
        return false ;
    }
    
}

//Fonction récursive récupérant les instants des clés mises sur un ensemble de properties
//Layer = Object - Calque sur lequel travailler | item = Object - Le propertyGroup à Analyser | Colour = Number - label à utiliser pour l'ajout de marqueur
//Return = Ø
function GetKeysTime( Layer , item , Colour ) {
    
    var myMarker = new MarkerValue("");
    for( var i = 1 ; i <= item.numProperties ; i++ )
    {
        if( item.property(i).numProperties != undefined )
        {
            GetKeysTime( Layer , item.property(i) , Colour )
        } else {
            if( item.property(i).numKeys > 0 )
            {
                for( var j = 1 ; j <= item.property(i).numKeys ; j++ )
                {
                    var KeyTime = parseFloat( item.property(i).keyTime( j ) );
                    myMarker.label = Colour ;
                    Layer.property(1).setValueAtTime( KeyTime , myMarker );
                }
            }
        }
    }
    
}