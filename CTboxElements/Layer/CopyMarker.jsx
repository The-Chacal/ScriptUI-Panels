/*Fonctions permettant de copier les markers d'un calque sur d'autres.*/

//Fonction créant l'interface de choix des calques à traiter.
//Return = Ø
function CopyMarkerSelect(){
    
    if( app.project.activeItem != undefined && app.project.activeItem.numLayers > 1 )
    {
        var Comp = app.project.activeItem ;
        var CompLayersName = [] ;
        for( var i = 1 ; i <= Comp.layers.length ; i++ )
        {
            CompLayersName.push( i + " - " + Comp.layer(i).name );
        }
        
        var CopyMarkerSelectDlg = new Window( "palette" , { en: "Choose your Layers." , fr: "Choisis tes Calques." } );
        CopyMarkerSelectDlg.global = CopyMarkerSelectDlg.add( "Group" );
        CopyMarkerSelectDlg.global.preferredSize = [ 300 , -1 ];
        CopyMarkerSelectDlg.global.orientation = "Column" ;
        CopyMarkerSelectDlg.global.alignChildren = "fill" ;
        CopyMarkerSelectDlg.global.spacing = 0 ;
            var Bloc1 = CopyMarkerSelectDlg.global.add( "Panel" , undefined , { en: "Markers to Copy : " , fr: "Marqueurs à Copier : " } );
            Bloc1.alignChildren = "Fill" ;
                var RefLayerSelector = Bloc1.add( "Dropdownlist" , undefined , CompLayersName );
                RefLayerSelector.title = { en: "Source Layer" , fr: "Calque Source : " } ;
                RefLayerSelector.titleLayout.characters = 10 ;
            var Bloc2 = CopyMarkerSelectDlg.global.add( "Panel" , undefined , { en: "Layers to Modifiy" , fr: "Calque(s) à Modifier : " } );
            Bloc2.alignChildren = "Fill" ;
            Bloc2.spacing = 2 ;
                Bloc2.Rows = Bloc2.add( "Group" );
                Bloc2.Rows.alignChildren = "Fill" ;
                Bloc2.Rows.orientation = "Column" ;
                Bloc2.Rows.spacing = 2
                    var Rows = {} ;
                Bloc2.Btns = Bloc2.add( "Group" );
                Bloc2.Btns.alignment = "Right" ;
                Bloc2.Btns.spacing = 2 ;
                Bloc2.Btns.margins = [ 0 , 2 , 0 , 0 ] ;
                    var AddRowBtn = Bloc2.Btns.add( "IconButton" , undefined , new File( Folder.appPackage.fsName + "/PNG/SP_Add_Sm_N_D.png") );
                    AddRowBtn.size = [ 20 , 20 ] ;
                    var SupRowBtn = Bloc2.Btns.add( "IconButton" , undefined , new File( Folder.appPackage.fsName + "/PNG/SP_Minus_Sm_N_D.png") );
                    SupRowBtn.size = [ 20 , 20 ] ;
            var Bloc3 = CopyMarkerSelectDlg.global.add( "Group" );
            Bloc3.orientation = "Row" ;
            Bloc3.alignment = "Center" ;
            Bloc3.margins = [ 5 , 5 , 5 , 0];
                var B3Btn1 = Bloc3.add( "Button" , undefined , { en: "Copy" , fr: "Copier" } );
                B3Btn1.size = [ 75 , 25 ] ;
                var B3Btn2 = Bloc3.add( "Button" , undefined , { en: "Cancel" , fr: "Annuler" } );
                B3Btn2.size = [ 75 , 25 ] ;

        AddRowBtn.onClick = function() { ManageRows( Bloc2.Rows , Rows , 1 , CompLayersName ) ; };
        SupRowBtn.onClick = function() { ManageRows( Bloc2.Rows , Rows , -1 , CompLayersName ) ; };
        B3Btn1.onClick = function() { if( CopyMarkers( RefLayerSelector.selection.index + 1 , Bloc2.Rows ) ) { CopyMarkerSelectDlg.close(); } }
        B3Btn2.onClick = function() { CopyMarkerSelectDlg.close(); }
        
        var LayerSelection = CTcheckSelectedLayers() ;
        if( LayerSelection.length > 1 )
        {
            Rows = ManageRows( Bloc2.Rows , Rows , LayerSelection.length - 1 , CompLayersName );
        } else {
            Rows = ManageRows( Bloc2.Rows , Rows , 1 , CompLayersName );
        }
        
        if( LayerSelection.length >= 1 )
        {
            RefLayerSelector.selection = RefLayerSelector.items[ LayerSelection[0].index - 1 ];
            if( LayerSelection.length > 1 )
            {
                for( var i = 1 ; i < LayerSelection.length ; i ++ )
                {
                    Rows[ "Row" + i ].selection = Rows[ "Row" + i ].items[ LayerSelection[i].index - 1 ];
                }
            } else {
                Rows[ "Row1" ].selection = Rows[ "Row1" ].items[0] ;
            }
        } else {
            RefLayerSelector.selection = RefLayerSelector.items[0];
            Rows[ "Row1" ].selection = Rows[ "Row1" ].items[1] ;
        }
        
        CopyMarkerSelectDlg.show();
        CopyMarkerSelectDlg.defaultElement = B3Btn1 ;
        CopyMarkerSelectDlg.cancelElement = B3Btn2 ;
    }

}

//Fonction ajoutant/supprimant des lignes contenant des dropdownlists à l'interface en fonction du nombre demandé.
//DlgGroup = String - Nom du container recevant les lignes | Rows = Object - Tableau contenant les lignes existantes. | nbRows = Number - Nombre de lignes à ajouter ou supprimer | ItemList = Array - Liste de chaînes de caractères à afficher dans les dropdownlist
//Return = [ Objects ] - La liste des lignes modifiée.
function ManageRows( DlgGroup, Rows , nbRows , ItemList ){
    
    if( nbRows > 0 && DlgGroup.children.length <= ItemList.length - 2 )//-2 pour ne pas compter l'item vide ni l'item utilisé comme référence.
    {
        var NbExistingRows = DlgGroup.children.length ;
        for( var i = 1 ; i <= nbRows ; i++ )
        {
            Rows[ "Row" + ( NbExistingRows + i ) ] = DlgGroup.add( "Dropdownlist" , undefined , ItemList );
            Rows[ "Row" + ( NbExistingRows + i ) ].title = { en: "Layer " + parseFloat( NbExistingRows + i ) + " : " , fr: "Calque " + parseFloat( NbExistingRows + i ) + " : " } ;
            Rows[ "Row" + ( NbExistingRows + i ) ].titleLayout.characters = 10 ;
            Rows[ "Row" + ( NbExistingRows + i ) ].selection = Rows[ "Row" + ( NbExistingRows + i ) ].items[ i - 1 ] ;
        }
    } else if( nbRows < 0 && DlgGroup.children.length > 1) {
        var NbRows = DlgGroup.children.length ;
        DlgGroup.remove( DlgGroup.children[ NbRows - 1 ] );
    }
    DlgGroup.window.preferredSize = [ 300 , -1 ];
    DlgGroup.window.layout.layout( true );
    return Rows

}

//Copie les marqueurs du calque ref sur les calques selectionnés. 
//RefLayerIndex = number - index du calque référence pour la copie des markers | DlgGroup = Object - Container contenant les lignes avec dropdown list.
//Return = Boolean - A réussi ou non à faire les copies.
function CopyMarkers( RefLayerIndex , DlgGroup ){
    
    var Comp = app.project.activeItem ;
    var MarkersToCopy = [] ;
    if( Comp.layer( RefLayerIndex ).property(1).numKeys > 0 )
    {   
        for( var i = 1 ; i <= Comp.layer( RefLayerIndex ).property(1).numKeys ; i++ ) 
        {
            MarkersToCopy.push( Comp.layer( RefLayerIndex ).property(1).keyTime( i ) );
        }
    } else {
        CTdlg( { en: "No, no , no..." , fr: "Non, non, non..." } , { en: "Error : " , fr: "Erreur : " } , { en: "   There is no Markers on the Source Layer.\n   What do you want me to do???" , fr: "   Il n'y a pas de marqueurs sur le Calque Source.\n   Tu veux que je fasse quoi???"});
        return false ;
    }
    //Création d'un array contenant les index des calques à modifier.
    var LayersToModifyIndex = [] ;
    for( i = 0 ; i < DlgGroup.children.length ; i++ )
    {
        if( DlgGroup.children[i].selection.index + 1 != RefLayerIndex )
        {
            var IndexFound = false
            for( var j = 0 ; j < LayersToModifyIndex.length ; j++ )
            {   
                if( DlgGroup.children[i].selection.index + 1 == LayersToModifyIndex[j] )
                {
                    IndexFound = true ;
                    break
                }
            }
            if( !IndexFound )
            {
                LayersToModifyIndex.push( DlgGroup.children[i].selection.index + 1 );
            }
        }
    }
    //Copie des Marqueurs sur les calques choisis
    for( i = 0 ; i < LayersToModifyIndex.length ; i++ )
    {
        
        app.beginUndoGroup( { en: "Markers Copy" , fr: "Copie de Marqueurs" } );
        
        for( var j = 0 ; j < MarkersToCopy.length ; j++ )
        {
            Comp.layer( LayersToModifyIndex[i] ).property(1).addKey( MarkersToCopy[j] );
        }
        
        app.endUndoGroup();
        
    }
    CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished copying Markers." , fr: "J'ai finis de copier les Marqueurs demandés." } );
    return true ;
    
}
