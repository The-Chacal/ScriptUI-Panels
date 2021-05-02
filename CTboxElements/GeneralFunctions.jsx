//****************************************//
//   General Functions v1.0
//****************************************//

////////////////////////////////////////////
// Fonctions ouvrant des fenêtres pour communiquer avec l'utilisateur.
////////////////////////////////////////////

//Ouvre une fenêtre d'Erreur empêchant l'utilisateur de continuer à moins qu'il ne valide.
//Titre = String - Nom de la fenêtre | Contenu = String - Message affiché 
//Return = Ø
function CTdlg( Titre , PanelName , Contenu ){
    
    var CTerrorDlg = new Window( "dialog" , Titre );
        CTerrorDlg.global = CTerrorDlg.add( "Panel" , undefined , PanelName );
        CTerrorDlg.global.preferredSize = [ 200 , -1 ];
        CTerrorDlg.global.msg = CTerrorDlg.global.add( "statictext" , undefined , Contenu, { multiline: true } );
        CTerrorDlg.global.msg.alignment = "Center" ;
        CTerrorDlg.global.add( "Button" , undefined , "Ok" );
    
    CTerrorDlg.show();
      
  }
  
//Ouvre une fenêtre de choix bloquant les possibilités d'action de l'utilisateur.
//Titre = String - Nom de la fenêtre | Contenu = String- Message affiché | (Optionnel) BoutonA = String - Texte du premier bouton | (Optionnel)BoutonB = String - Texte du second bouton 
//Return = Boolean - oui ou non
function CTchoiceDlg( Titre , Contenu , BoutonA , BoutonB ){

    if( BoutonA == undefined )
    {
        BoutonA = { en: "Yes" , fr: "Oui" } ;
    }
    if( BoutonB == undefined )
    {
        BoutonB = { en: "No" , fr: "Non" } ;
    }

    var CTchoiceDlg = new Window( "dialog" , Titre );
        CTchoiceDlg.global = CTchoiceDlg.add( "Panel" , undefined , { en: "Dilemma" , fr: "Dilemme :" } );
        CTchoiceDlg.global.preferredSize = [ 200 , -1 ];
            CTchoiceDlg.global.msg = CTchoiceDlg.global.add( "statictext" , undefined , Contenu, { multiline: true } );
            CTchoiceDlg.global.msg.alignment = "fill" ;
            CTchoiceDlg.global.Btns = CTchoiceDlg.global.add( "Group" ,  undefined ) ;
            CTchoiceDlg.global.Btns.orientation = "Row" ;
            var CTbtnA = CTchoiceDlg.global.Btns.add( "Button" , undefined , BoutonA );
            var CTbtnB = CTchoiceDlg.global.Btns.add( "Button" , undefined , BoutonB );
        
    var Choice = null ;

    CTbtnA.onClick = function(){ Choice = true ; CTchoiceDlg.close() ; }
    CTbtnB.onClick = function(){ Choice = false ; CTchoiceDlg.close() ; }
    CTchoiceDlg.defaultElement = CTbtnA ;

    CTchoiceDlg.show();

    return Choice ;

}

////////////////////////////////////////////
//Fonctions Utilitaires
////////////////////////////////////////////

//Fonction vérifiant si il existe bien des calques selectionnés. 
//(Optionnel) NbConstraint = Number - Nombre de calques selectionnés nécessaires. Si non défini, le script vérifie qu'il y ait au moins un calque de selectionné.
// Return = Array - les calques selectionnés.
function CTcheckSelectedLayers( NbConstraint ){

    var LayersSelected = []
    if( app.project.activeItem != undefined && app.project.activeItem.selectedLayers.length > 0 )
    {
        LayersSelected = app.project.activeItem.selectedLayers ;
        
        if( NbConstraint != undefined && LayersSelected.length != NbConstraint )
        {
            CTdlg( { en: "But..." , fr: "Mais..." } , { en: "Error : " , fr: "Erreur : " } , { en: "I do not have the right amount of selected layers.\n   I want " + NbConstraint + "of them.\n\n   Bye" , fr: "Je n'ai pas le bon nombre de Calque(s) selectionné(s) pour bosser.\n  J'en veux " + NbConstraint + ".\n\n   Merci, au revoir" } );
        }
    }
    return LayersSelected ;

}

//Fonction vérifiant si il existe bien des propriétés selectionnées.
//(Optionnel) NbConstraint =  Nombre de propriétés selectionnées nécessaires. Si non défini, le script vérifie qu'il y ait au moins une propriété de selectionnée.
//Return = Array - les propriétés selectionnées éditables.
function CTcheckSelectedProperties( NbConstraint ){

    var PropSelected = []
    if( app.project.activeItem != undefined && app.project.activeItem.selectedProperties.length > 0 )
    {
        for( var i = 0 ; i < app.project.activeItem.selectedProperties.length ; i ++ )
        {
            if( app.project.activeItem.selectedProperties[i].propertyType == PropertyType.PROPERTY )
            {
                PropSelected.push( app.project.activeItem.selectedProperties[i] );
            } 
        }

        if( PropSelected.length > 0 && NbConstraint != undefined && PropSelected.length != NbConstraint )
        {
            CTdlg( { en: "But..." , fr: "Mais..." } , { en: "Error : " , fr: "Erreur : " } , { en:  "I do not have the right amount of selected Properties.\n   I want " + NbConstraint + " of them.\n\n   Bye" , fr: "Je n'ai pas le bon nombre de Propriété(s) selectionnée(s) pour bosser.\r   J'en veux " + NbConstraint + ".\r\r   Merci, au revoir" } );
        }
    }
    return PropSelected ;

}

//fonction récursive permettant de savoir à quel calque appartient une propriété
//Prop = Object - propriété dont on veut connaître le calque parent
//resut = Object - le Calque parent de la propriété
function CTgetPropParentLayer( Prop ){
    
    var PropLayer = Prop.parentProperty ;
    for( var j = 1 ; j < Prop.propertyDepth ; j++ )
    {
        PropLayer = PropLayer.parentProperty ;
    }
    return PropLayer ;
    
}

//Fonction sauvegardant une chaine de caractères dans un fichier txt. 
//SaveFileName = String - Nom du fichier txt dans lequel sauvegarder la chaîne de caractères. | StringName = String - Nom de la chaîne de cractères | StringToSave = String - la chaîne de caractères 
//Return = Ø
function CTsaveString( SaveFileName , StringName , StringToSave ){

    var SaveFile = new File( Folder.userData.fsName + "/" + SaveFileName + ".txt" );
    if( SaveFile.exists )
    {
        SaveFile.open( "r" );
        var SaveFileString = SaveFile.read();
        SaveFile.close()
        var StringNameIndex = SaveFileString.search( StringName );
        if( StringNameIndex != -1 )
        {
            var StringStartIndex = StringNameIndex + StringName.length + 1 ;
            var StringEndIndex = SaveFileString.search( "</Path" + StringName + ">" );
            var OldString = SaveFileString.slice( StringStartIndex , StringEndIndex );
            SaveFileString = SaveFileString.replace( OldString , StringToSave );
        } else {
            SaveFileString = SaveFileString.concat( "<Path" + StringName + ">" + StringToSave + "</Path" + StringName + ">\r\n" );
        }
        SaveFile.open("w");
        SaveFile.write( SaveFileString );
    } else {
        SaveFile.open( "w" );
        SaveFile.write("<Path" + StringName + ">" + StringToSave + "</Path" + StringName + ">\r\n");
    }
    SaveFile.close();

}

//Fonction récupérant une chaine de caractères dans un fichier txt.
//SaveFileName = String - Nom du fichier txt dans lequel chercher la chaîne de caractères. | StringName = String - Nom de la chaîne de cractère 
//Return = String ou null
function CTgetSavedString( SaveFileName , StringName ){

    //Récupération du fichier de sauvegarde.
    var SaveFile = new File( Folder.userData.fsName + "/" + SaveFileName + ".txt" );
    if( SaveFile.exists )
    {
        SaveFile.open( "r" );
        var SaveFileString = SaveFile.read();
        SaveFile.close();
    } else {
        return null ;
    }

    //Récupération du chemin du dossier sauvegardé
    var StringNameIndex = SaveFileString.search( StringName );
    if( StringNameIndex != -1 )
    {
        var StringStartIndex = StringNameIndex + StringName.length + 1 ;
        var StringEndIndex = SaveFileString.search( "</Path" + StringName + ">" );
        var String = SaveFileString.slice( StringStartIndex , StringEndIndex );
        return String ;
    } else {
        return null ;
    }

}