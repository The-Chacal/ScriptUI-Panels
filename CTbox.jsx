////////////////////////////////////////////
//Lancement du Script
////////////////////////////////////////////

$.localize = true;

if ( CTcheckScriptWriting( this ) )
{
    //@include "CTboxElements/GeneralFunctions.jsx"

    //@include "CTboxElements/Expressions/MarkerAccum.jsx";
    //@include "CTboxElements/Expressions/MarkerAnimation.jsx";
    //@include "CTboxElements/Expressions/PosterizeProperty.jsx";
    //@include "CTboxElements/Expressions/UpdateExp.jsx";

    //@include "CTboxElements/Layer/AnimationDetector.jsx";
    //@include "CTboxElements/Layer/ApplyGradient.jsx";
    //@include "CTboxElements/Layer/ApplySilhouetteShadow.jsx";
    //@include "CTboxElements/Layer/CleanLayer.jsx";
    //@include "CTboxElements/Layer/CopyMarker.jsx";
    //@include "CTboxElements/Layer/CreateCastshadow.jsx";
    //@include "CTboxElements/Layer/CreateMarkersForKeys.jsx";
    //@include "CTboxElements/Layer/DepthDisplacement.jsx";
    //@include "CTboxElements/Layer/GetLayerBottom.jsx";
    
    //@include "CTboxElements/Misc/CollapseTransformationManager.jsx";
    //@include "CTboxElements/Misc/CompLengthManager.jsx";

    CTbuildUI( this );
    
}

////////////////////////////////////////////
//Construction de l'Interface
////////////////////////////////////////////

function CTbuildUI( thisObj ){
    
    var CTpanel = thisObj ;
    if( CTpanel instanceof Panel == false )
    {
        CTpanel = new Window( "palette" , "CTbox" );
    }
    CTpanel.orientation = "Row" ;
    CTpanel.preferredSize = [ 100 , 250 ];
    CTpanel.global = CTpanel.add( "Group" );
    CTpanel.global.spacing = 5 ;
    CTpanel.global.orientation = "Column" ;
    CTpanel.global.alignment = "Top" ;
    CTpanel.global.alignChildren = "Fill" ;
    
        var Bloc0 = CTpanel.global.add( "group" );
        Bloc0.spacing = 0 ;
        Bloc0.alignment = "Center";
        Bloc0.orientation = "Row" ;
            var B0Btn1 = Bloc0.add( "iconButton" );
            B0Btn1.text = { en: "Exp" , fr: "Exp" };
            B0Btn1.helpTip = { en: "Expressions Panel" , fr: "Onglet Expressions" };
            B0Btn1.size = [ 25 , 25 ];
            var B0Btn2 = Bloc0.add( "iconButton" );
            B0Btn2.text = { en: "Lay" , fr: "Cal" };
            B0Btn2.helpTip = { en: "Layer Panel" , fr: "Onglet Calque" };
            B0Btn2.size = [ 25 , 25 ];
            var B0Btn3 = Bloc0.add( "iconButton" );
            B0Btn3.text = { en: "Mis" , fr: "Div" };
            B0Btn3.helpTip = { en: "Miscellaneous Panel", fr: "Onglet Divers" };
            B0Btn3.size = [ 25 , 25 ];
    
        var ButtonsBloc = CTpanel.global.add( "group" );
        ButtonsBloc.orientation = "Stack" ;
        ButtonsBloc.alignChildren = [ "Center" , "Top" ];
            var Bloc1 = ButtonsBloc.add( "Panel" , undefined , "Expressions :" );
            Bloc1.spacing = 2 ;
            Bloc1.margins = [ 5 , 10 , 5 , 5 ] ;
                var B1Btn1 = Bloc1.add( "Button" , undefined , { en: "Fix Exp" , fr: "Cor. Exp." } );
                B1Btn1.helpTip = { en: "   Allow to modify the expressions of layers or properties" , fr: "   Permet de modifier le texte des expressions du calque ou propriété selectionné." } ;
                B1Btn1.size = [ 75 , 25 ];
                var B1Btn2 = Bloc1.add( "Button" , undefined , "Psz. Pro." );
                B1Btn2.helpTip = { en: "   Posterize a property and add a Slider Effect to set the step" , fr : "   Posterize la propriété selectionnée et ajoute un paramètre glissière pour régler le pas." } ;
                B1Btn2.size = [ 75 , 25 ];
                var B1Btn3 = Bloc1.add( "Button" , undefined , "Mark. Accum." );
                B1Btn3.helpTip = { en: "   Add a variable to the expression of the selected properties that increase passing each marker on a layer." , fr: "   Crée une variable dans l'expression de la propriété selectionnée qui s'incrémente en passant les marqueurs présents sur le calque." } ;
                B1Btn3.size = [ 75 , 25 ];
                var B1Btn4 = Bloc1.add( "Button" , undefined , "Mark. Anim." );
                B1Btn4.helpTip = { en: "   Freeze the animation of a property until the next marker." , fr: "   Fait évoluer l'animation de la propriété séléctionnée qu'au passage des marqueurs présents sur le calque." } ;
                B1Btn4.size = [ 75 , 25 ];
            var Bloc2 = ButtonsBloc.add( "Panel" , undefined , { en: "Layer :" , fr: "Calque :" } );
            Bloc2.visible = false ;    
            Bloc2.spacing = 2 ;
            Bloc2.margins = [ 5 , 10 , 5 , 5 ] ;
                var B2Btn1 = Bloc2.add( "Button" , undefined , { en: "Mov. Dep." , fr: "Dep. Prof" } );
                B2Btn1.helpTip = { en: "   Move the layer to the depth wanted" , fr: "   Déplace le calque selectionné à la profondeur indiquée." } ;
                B2Btn1.size = [ 75 , 25 ];
                var B2Btn2 = Bloc2.add( "Button" , undefined , { en: "Loc. Bot." , fr: "Def. Bas" } );
                B2Btn2.helpTip = { en: "   Locate the lowest point of the layer for the length of the active layer.\n   Add a point Effect to the layer." , fr: "   Définit le point le plus bas d'un calque sur la durée.\n   Ajoute un paramètre Point au calque." } ;
                B2Btn2.size = [ 75 , 25 ];
                var B2Btn3 = Bloc2.add( "Button" , undefined , { en: "Cha. Sha." , fr : "Omb. Per." } );
                B2Btn3.helpTip = { en: "   Apply a Shadow over the character based on its silhouette.\n   Require the file \"CharacterShadow_v1.1.ffx\"." , fr: "   Applique une ombre propre au personnage à partir de sa silhouette.\n   Nécéssite le fichier \"CharacterShadow_v1.1.ffx\"." } ;
                B2Btn3.size = [ 75 , 25 ];
                var B2Btn4 = Bloc2.add( "Button" , undefined , { en: "Cast Sha." , fr: "Omb. Sol" } );
                B2Btn4.helpTip = { en: "   Create a layer which is the cast shadow of the selected layer.\n   Require the file \"CastShadow_v1.1.ffx\"." , fr: "   Crée un calque qui est l'ombre au sol des calques selectionnés.\n   Nécéssite le fichier \"CastShadow_v1.1.ffx\"." } ;
                B2Btn4.size = [ 75 , 25 ];
                var B2Btn5 = Bloc2.add( "Button" , undefined , { en: "Add Grad." , fr: "Aj. Degradé" } );
                B2Btn5.helpTip = { en: "   Add a Gradient in Overlay Mode.\n   Require the file \"Gradient_v1.1.ffx\"." , fr: "   Ajoute un dégradé en mode Incrustation.\n   Nécéssite le fichier \"Gradient_v1.1.ffx\"." } ;
                B2Btn5.size = [ 75 , 25 ];
                var B2Btn6 = Bloc2.add( "Button" , undefined , "Cop. Mark." );
                B2Btn6.helpTip = { en: "   Copy the Markers from the selected layer and pastes it over the other selected layers." , fr : "   Copie les Marqueurs du calque selectionné pour les copier sur d'autres." } ;
                B2Btn6.size = [ 75 , 25 ];
                var B2Btn7 = Bloc2.add( "Button" , undefined , "Key to Mark." );
                B2Btn7.helpTip = { en: "   Add markers for each animation key on the layer." , fr: "   Ajoute des Marqueurs pour chaque clé d'animation présente sur le calque." } ;
                B2Btn7.size = [ 75 , 25 ];
                var B2Btn8 = Bloc2.add( "Button" , undefined , "Det. Anim." );
                B2Btn8.helpTip = { en: "   Add a Marker on the layer if it \"moves\"." , fr: "   Ajoute un marqueur sur le calque quand l'animation evolue." } ;
                B2Btn8.size = [ 75 , 25 ];
                var B2BtnXX = Bloc2.add( "Button" , undefined , "Clean Layer" );
                B2BtnXX.helpTip = { en: "   Delete all effects and layer Styles on the seleted layer." , fr: "   Supprime tous les effets et style de calques des calques selectionnés" } ;
                B2BtnXX.size = [ 75 , 25 ];
            var Bloc3 = ButtonsBloc.add( "Panel" , undefined , { en: "Misc. :" , fr: "Divers :" } );
            Bloc3.visible = false ;
            Bloc3.spacing = 2 ;
            Bloc3.margins = [ 5 , 10 , 5 , 5 ] ;
                var B3Btn1 = Bloc3.add( "Button" , undefined , "Ext. Comp." );
                B3Btn1.helpTip = { en: "   Change the lenght of a comp and its elements to the duration wanted." , fr: "   Mets la composition et tous ses composants à la durée souhaitée." } ;
                B3Btn1.size = [ 75 , 25 ];
                var B3Btn2 = Bloc3.add( "Button" , undefined , { en: "Col. Comp." , fr: "Rast. Comp." } );
                B3Btn2.helpTip = { en: "Rasteurize the selected Composition and its elements.\n   Risky move to my opinion!" , fr: "   Rasteurise la composition et tous ses sous-compositions.\n   Pour gens ayant le goût du risque!"} ;
                B3Btn2.size = [ 75 , 25 ];
    
        var BlocXX = CTpanel.global.add( "Group" );
        BlocXX.margins = [ 5 , 10 , 5 , 5 ] ;
        BlocXX.alignment = "Right";
        BlocXX.spacing = 2 ;
            var Version = BlocXX.add( "Statictext" , undefined , "CTBox v1.0.0" );//x.y.z - x > major change | y > addition of a fonctionnality | z > debug 
            var BXBtn1 = BlocXX.add( "IconButton" , undefined , new File( Folder.appPackage.fsName + "/PNG/SP_ArrowNext_Sm_N_D.png") );
            var NotePadOn = false ;
            BXBtn1.size = [ 15 , 15 ];
    
    CTpanel.layout.layout( "true" );
    
    B0Btn1.onClick = function(){ Bloc2.visible = false ; Bloc3.visible = false ; Bloc1.visible = true ; CTsaveString( "CTBoxSave" , "VisiblePanel" , "0" ) };
    B0Btn2.onClick = function(){ Bloc1.visible = false ; Bloc3.visible = false ; Bloc2.visible = true ; CTsaveString( "CTBoxSave" , "VisiblePanel" , "1" )};
    B0Btn3.onClick = function(){ Bloc1.visible = false ; Bloc2.visible = false ; Bloc3.visible = true ; CTsaveString( "CTBoxSave" , "VisiblePanel" , "2" )};
    
    B1Btn1.onClick = MAJexp ;
    B1Btn2.onClick = PosterizeProp ;
    B1Btn3.onClick = MarkerAccum ;
    B1Btn4.onClick = MarkerAnimation ;
    
    B2Btn1.onClick = DepthChoice ;
    B2Btn2.onClick = function(){ GetLayerBottom( true , true ) } ;
    B2Btn3.onClick = ApplySilhouetteShadow ;
    B2Btn4.onClick = CreateCastShadow ;
    B2Btn5.onClick = ApplyGradient ;
    B2Btn6.onClick = CopyMarkerSelect ;
    B2Btn7.onClick = CreateMarkersForKeysChoice ;
    B2Btn8.onClick = AnimDetectionDlg ;
    B2BtnXX.onClick = function(){ CleanLayerChoice( true , true ) } ;
    
    B3Btn1.onClick = CompLengthChoice ;
    B3Btn2.onClick = CollapseTransformationManager ;
    
    BXBtn1.onClick = function(){ ExpandNotePad( CTpanel ) };
    //Vérifie quel est le dernier panel affiché
    var ActivePanel = CTgetSavedString( "CTBoxSave" , "VisiblePanel" ) ;
    if( ActivePanel != null )
    {
        Bloc0.children[ ActivePanel ].notify();
    }
    //Affiche la fenêtre si le script n'a pas été placé dans "ScriptsUI"
    if( CTpanel.type == "palette" )
    {
        CTpanel.show();
    }

}

//Cette fonction vérifie si After effects est paramétré pour laisser les scripts écrire des fichiers.
//Param1 = object - this 
//Return = Boolean
function CTcheckScriptWriting( Param1 ) {

    if ( app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") !=1 )
    {
        //Création du panneau indiquant que les scripts ne sont pas autorisés à écrire sur l'ordinateur.
        var BugPanel = Param1.add( "Panel" , undefined , { en: "Small Problem : " , fr: "Petit Problème :" } );
        BugPanel.add( "StaticText" , undefined , { en: "You need to authorize the scripts to write files and access network in the Preferences.\n\n   You need to close this, make the change, then relaunch the Script." , fr: "   Vous devez autoriser les scripts à écrire des fichiers et accéder au réseau dans les préférences.\n\n   Fermez, modifiez puis relancez ce script." } , { multiline: true } );

        Param1.layout.layout( true );

        return false ;
    } else {
    return true ;
    }

}

////////////////////////////////////////////
// Fonctions de l'UI
////////////////////////////////////////////

//Developpe le bloc note 
//Dlg = Object - Panneau auquel ajouter le note pad
//Return = Ø
function ExpandNotePad( Dlg ){
    if( Dlg.children.length < 2 )
    {
        var NotePad = Dlg.add( "Panel" , undefined , { en: "Notepad" , fr: "Bloc-Note : " } )
        NotePad.alignment = "Top" ;
        NotePad.margins = [ 5 , 8 , 5 , 5 ];
            var NotePadtext = NotePad.add( "EditText" , undefined , { en: "You can write or thoughts here..." , fr: "   Note ici tes pensées..." } , { multiline: true , scrollable: true } );
            var SavedText = CTgetSavedString( "CTBoxSave" , "Notepad" );
            if( SavedText != undefined )
            {
                NotePadtext.text = SavedText ;
            }
        NotePadtext.preferredSize   = [ 200 , Dlg.global.size[1] - 20 ];
        NotePadtext.onActivate = function(){ if( NotePadtext.text == { en : "You can write or thoughts here..." , fr: "   Note ici tes pensées..." } ){ NotePadtext.text = "" ; } }
        NotePadtext.onChange = function(){ CTsaveString( "CTBoxSave" , "Notepad" , NotePadtext.text ) }
    } else {
        Dlg.remove( Dlg.children[1] );
    }
        
    Dlg.layout.layout(true)
    
}

