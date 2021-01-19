/*Fonctions permettant d'ajouter un marqueur dès qu'un mouvement est detecté sur le calque.*/

//Fonction ajoutant un marqueur sur le calque quand il détecte un changement.
//Precision = Number - Precision de la Detection | Number - Tolerance de la Detection 
//Return = Boolean - A réussi
function DetectAnimation( Precision , Tolerance ){
    
    var LayerSelection = CTcheckSelectedLayers();
    if( LayerSelection.length > 0 )
    {
        for( var i = 0 ; i < LayerSelection.length ; i++ )
        {
            
            app.beginUndoGroup( { en: "Animation Detection." , fr: "Detection de l'Animation." } );
            
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
            //Application de l'expression permettant de detecter un changement de couleur sur le calque
            var ChangeDetector = LayerSelection[i].property(5).addProperty( "ADBE Slider Control" );
            ChangeDetector.name = "LayerColorControl";
            ChangeDetector = ChangeDetector.property(1)
            ChangeDetector.expression = "var Precision = Math.pow( 2 , " + Precision + " );\
var Tolerance = " + Tolerance + ";\
var Setting = [thisLayer.width / Precision , thisLayer.height / Precision ];\
var AverageDelta = 0;\
for( var y = Setting[1] ; y < thisLayer.height ; y += 2 * Setting[1] )\
{\
    for( var x = Setting[0] ; x < thisLayer.width ; x += 2 * Setting[0] )\
    {\
        var ColorA = thisLayer.sampleImage( [ x , y ] , Setting , postEffect = true , time );\
        var ColorB = thisLayer.sampleImage( [ x , y ] , Setting , postEffect = true , time - thisComp.frameDuration );\
        var DeltaAB = 0 ;\
        for( var i = 0 ; i < 4 ; i++ )\
        {\
            DeltaAB += Math.max( 0 , Math.abs( ColorA[i] - ColorB[i] ) * 100 - Tolerance );\
        }\
        AverageDelta = ( AverageDelta + DeltaAB / 4 );\
    }\
}\
if( AverageDelta == 0 )\
{ 0; } else { 1; }";
            ChangeDetector.selected = true;
            app.executeCommand( 2639 ); //Execute la commande "Animation > Assistant d'images clés > Convertion l'expression en images clés".
            ChangeDetector.selected = false;
            ChangeDetector.expression = "";
            var AnimKeys = [] ;
            for( j = 1 ; j <= ChangeDetector.numKeys ; j ++ )
            {
                if( ChangeDetector.keyValue( j ) == 1 )
                {
                    LayerSelection[i].property(1).addKey( ChangeDetector.keyTime( j ) );
                }
            }
            ChangeDetector.parentProperty.remove();

            app.endUndoGroup();
            
        }
        CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished detecting Animation on your layers." , fr: "   J'ai fini de détecter les phases d'anim de tes calques." } );
        return true ;
    }
    
}

//Fonction créant le panneau d'options pour la detection de l'animation.
//Return = Ø
function AnimDetectionDlg(){

    var AnimDetectionDlg = new Window( "palette" , { en: "Detection Settings" , fr: "Paramètres de Detection"} );
    AnimDetectionDlg.global = AnimDetectionDlg.add( "group" );
    AnimDetectionDlg.global.preferredSize = [ 200 , -1 ];
    AnimDetectionDlg.global.orientation = "Column" ;
    AnimDetectionDlg.global.alignChildren = "fill" ;
    AnimDetectionDlg.global.spacing = 0 ;
        var PresetLine = AnimDetectionDlg.global.add( "group" );
        PresetLine.alignChildren = [ "center" , "fill"];
            PresetLine.add( "statictext{ text: 'Preset : ' , characters: 5 }" );
            var PresetSelector = PresetLine.add( "dropdownlist" , undefined , [ { en: "None" , fr: "Aucun" } , "Anim 2D/3D" , "Stopmotion" ] );
            PresetSelector.selection = PresetSelector.items[0];
        var Settings = AnimDetectionDlg.global.add( "panel" , undefined , { en: "Settings : " , fr: "Paramètres" } );
        Settings.alignChildren = "Fill" ;
        Settings.spacing = 0 ;
            var SettingsLine1 = Settings.add( "group" );
            SettingsLine1.alignChildren = [ "center" , "fill"];
            SettingsLine1.orientation = "Row" ;
                SettingsLine1.add( "statictext" , undefined , "Precision :" );
                var PrecisionValue = SettingsLine1.add( "edittext{ text: '1' , justify: 'center' , characters: 4 }" );
            var PrecisionSlider = Settings.add( "slider" , undefined , 1 , 1 , 10 );
            var SettingsLine2 = Settings.add( "group" )
            SettingsLine2.orientation = "Row" ;
            SettingsLine2.alignChildren = [ "center" , "fill"];
                SettingsLine2.add( "statictext" , undefined , "Tolerance :" );
                var ToleranceValue = SettingsLine2.add( "edittext{ text: '0' , justify: 'center' , characters: 4 }" );
            var ToleranceSlider = Settings.add( "slider" , undefined , 0 , 0 , 5 );
        var Buttons = AnimDetectionDlg.global.add( "group" );
        Buttons.alignChildren = [ "center" , "fill"];
        Buttons.margins = 5 ;
            var BtnA = Buttons.add( "button" , undefined , { en: "Continue" , fr: "Continuer" } );
            var BtnB = Buttons.add( "button" , undefined , { en: "Cancel" , fr: "Annuler" } );

    AnimDetectionDlg.defaultElement = BtnA ;
    AnimDetectionDlg.cancelElement = BtnB ;
    PresetSelector.onChange = function(){ if( PresetSelector.selection.text == "Anim 2D/3D"){ PrecisionValue.text = 1 , PrecisionSlider.value = 1 , ToleranceValue.text = 0 , ToleranceSlider.value = 0 } else if( PresetSelector.selection.text == "Stopmotion"){ PrecisionValue.text = 4 , PrecisionSlider.value = 4 , ToleranceValue.text = 1 , ToleranceSlider.value = 1 } }
    PrecisionValue.onChange = function(){ PrecisionSlider.value = PrecisionValue.text };
    PrecisionSlider.onChanging = function(){ PrecisionValue.text = Math.round( PrecisionSlider.value ); }
    ToleranceValue.onChange = function(){ ToleranceSlider.value = ToleranceValue.text };
    ToleranceSlider.onChanging = function(){ ToleranceValue.text = Math.round( ToleranceSlider.value * 10 ) /10 ; }
    BtnA.onClick = function(){ if( DetectAnimation( parseFloat( PrecisionValue.text ) , parseFloat( ToleranceValue.text ) ) ){ AnimDetectionDlg.close(); } }
    BtnB.onClick = function(){ AnimDetectionDlg.close(); }
    AnimDetectionDlg.show();

}