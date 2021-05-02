//****************************************//
//   Update Expressions v1.0
//****************************************//

////////////////////////////////////////////
//Script permettant la recherche et la modification d'expressions dans les calques selectionnés ou les propriétés selectionnées.
////////////////////////////////////////////

//Fonction créant l'interface pour définir le texte à remplacer et le texte remplaçant.
//Return = Ø
function MAJexp(){
    
    var MAJexpDlg = new Window( "palette" , { en: "Expression Modifier" ,  fr: "Modificateur d'Expressions." } );
    MAJexpDlg.global = MAJexpDlg.add( "Panel" , undefined , { en: "Upd. Expression : " , fr: "MAJ Expression : " } );
    MAJexpDlg.global.alignChildren = "Fill" ;
        MAJexpDlg.Row1 = MAJexpDlg.global.add( "Group" );
        MAJexpDlg.Row1.orientation = "Row" ;
        MAJexpDlg.Row1.alignchildren = "Left" ;
            var Row1Text = MAJexpDlg.Row1.add( "StaticText" , undefined , { en: 'Text to Replace : ' , fr: 'Texte à Remplacer : ' } );
            Row1Text.characters = 11 ;
            var TextToReplace = MAJexpDlg.Row1.add( "EditText{ justify : 'right' , characters : 15 , properties : { enabled : true } }" );
            TextToReplace.text = { en: "Text to Replace" , fr: "Texte à Remplacer" };
        MAJexpDlg.Row2 = MAJexpDlg.global.add( "Group" );
        MAJexpDlg.Row2.orientation = "Row" ;
        MAJexpDlg.Row2.alignchildren = "Left" ;
            var Row2Text = MAJexpDlg.Row2.add( "StaticText" , undefined , { en: 'Replace by : ' , fr: 'Remplacer par : ' } );
            Row2Text.characters = 11 ;
            var ReplacementText = MAJexpDlg.Row2.add( "EditText{ justify : 'right' , characters : 15 , properties : { enabled : true } }" );
            ReplacementText.text = { en: 'Text to Use' , fr: 'Texte à Utiliser' };
        MAJexpDlg.Row3 = MAJexpDlg.global.add( "Group" );
        MAJexpDlg.Row3.orientation = "Row" ;
        MAJexpDlg.Row3.alignment = "center" ;
            var onLayers = MAJexpDlg.Row3.add( "radiobutton" , undefined , { en : " - by Layer." , fr: " - par Calque." } );
            onLayers.characters = 10 ;
            onLayers.value = true ;
            var onProps = MAJexpDlg.Row3.add( "radiobutton" , undefined , { en: " - by Properties." , fr: " - par Propriétés." } );
            onProps.characters = 10 ;
        MAJexpDlg.Btns = MAJexpDlg.global.add( "Group" )
        MAJexpDlg.Btns.orientation = "Row" ;
        MAJexpDlg.Btns.alignment = "Center" ;
            var Replace = MAJexpDlg.Btns.add( "Button" , undefined , { en: "Replace" , fr: "Remplacer" } );
            var CTannule = MAJexpDlg.Btns.add( "Button" , undefined , { en: "Cancel" , fr: "Annuler"} );
    
    TextToReplace.onActivate = function(){ if( TextToReplace.text == { en: "Text to Replace" , fr: "Texte à Remplacer" } ){ TextToReplace.text = "" ; } } ;
    ReplacementText.onActivate = function(){ if( ReplacementText.text == { en: "Text to Use" , fr: "Texte à Utiliser" } ){ ReplacementText.text = "" ; } } ;
    Replace.onClick = function(){ UpdateExp( TextToReplace.text , ReplacementText.text , onLayers.value ); } ;
    CTannule.onClick = function(){ MAJexpDlg.close() } ;
    
    MAJexpDlg.show();

}

//Fonction triant les éléments donc les expressions doivent être mise à jour.
//TextA = string - Texte à remplacer | TextB = string- texte de remplacement | LayersOrProperties = Boolean - Choix de travailler sur les calques ou les propriétés.
//Return = Ø
function UpdateExp( TextA , TextB , LayersOrProperties ){
    
    if( TextA == { en: "Text to Replace" , fr: "Texte à Remplacer" } || TextA == "" )
    {
        CTdlg( { en: "Ouch" , fr: "Aïe" } , { en: "Error : " , fr: "Erreur : " } , { en: "   You did not tell me what to replace" , fr: "   Tu ne m'a pas dis quoi remplacer." } );
        return ;
    } else if( TextB ==  { en: "Text to Use" , fr: "Texte à Utiliser" } )
    {
        CTdlg( { en: "Ouch" , fr: "Aïe" } , { en: "Error : " , fr: "Erreur : " } , { en: "   You did not tell me what to replace with." , fr: "   Tu ne m'a pas dis par quoi remplacer." } );
        return ;
    }
    
    if( LayersOrProperties )
    {
        var LayersToUpdate = CTcheckSelectedLayers();
        if( LayersToUpdate.length > 0 )
        {
            for( var i = 0 ; i < LayersToUpdate.length ; i++ )
            {
                app.beginUndoGroup( { en: "Expression Modification" , fr: "Modification de l'Expression" } );
                
                ApplyExpUpdate( LayersToUpdate[i] , TextA , TextB ) ;
                
                app.endUndoGroup() ;
            }
            CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "Error : " , fr: "Erreur : " } , { en: "I've finished updating your expressions" , fr: "   J'ai fini de mettre à jour tes expressions." } );
        }
    } else {
        var PropSelected = CTcheckSelectedProperties();
        if( PropSelected.length > 0 )
        {
            var PropsToUpdate = [] ;
            for( var i = 0 ; i < PropSelected.length ; i ++ )
            {
                if( PropSelected[i].canSetExpression )
                {
                    app.beginUndoGroup( {en: "Expression Modification" , fr: "Modification de l'Expression" } );
                    
                    var reg = new RegExp( TextA.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), "g");//"$&" est "la chaine trouvée" donc le replace échappe les caractères spéciaux dans la chaine de recherche.
                    PropSelected[i].expression = PropSelected[i].expression.replace( reg , TextB );
                    
                    app.endUndoGroup() ;
                }
            }
            CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished updating your expressions" , fr: "   J'ai fini de mettre à jour tes expressions." } );
        }
    }
    
    
}

//Fonction récursive parcourant toutes les properties d'un calque.
//item = Object - Property ou Property Base | TextA = string - Texte à remplacer | TextB = string- texte de remplacement
//Return = Ø
function ApplyExpUpdate( item , TextA , TextB ){
    
    for( var i = 1 ;  i <= item.numProperties ; i++ )
    {   
        if( item.property(i).numProperties != undefined )
        {
            ApplyExpUpdate( item.property(i) , TextA , TextB );
        } else {
            if( item.property(i).canSetExpression && item.property(i).expression != "" )
            {
                var reg = new RegExp( TextA.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), "g");//"$&" est "la chaine trouvée", donc le replace() échappe les caractères spéciaux dans la chaine de recherche.
                item.property(i).expression = item.property(i).expression.replace( reg , TextB );
            }
        }
    }
    
}
