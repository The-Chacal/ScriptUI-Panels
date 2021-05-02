//****************************************//
//   Compositions Length Manager v1.0
//****************************************//

////////////////////////////////////////////
// Fonctions Permettant de régler la durée d'une composition et de tous ses composants
////////////////////////////////////////////

//Fonction ouvrant l'interface pour choisir la nouvelle durée de la composition.
//Return = Ø
function CompLengthChoice(){
    
    var CompLengthChoiceDlg = new Window( "palette" , { en:"Choice of the new Duration" , fr: "Choix de la nouvelle durée" } );
    CompLengthChoiceDlg.frameLocation = [ 960 , 500 ] ;
    CompLengthChoiceDlg.global = CompLengthChoiceDlg.add( "Panel" , undefined , { en: "Settings :" , fr: "Réglages :" } );
    CompLengthChoiceDlg.global.orientation = "Column" ;
    CompLengthChoiceDlg.global.alignChildren = "Fill" ; 
    CompLengthChoiceDlg.global.spacing = 5 ;
    CompLengthChoiceDlg.global.margins = [ 5 , 10 , 5 , 5 ] ;
        var Row1 = CompLengthChoiceDlg.global.add( "Group" );
        Row1.orientation = "Row";
        Row1.spacing = 5 ;
        Row1.alignChildren = [ "Left" , "Center" ];
            Row1.Selector = Row1.add( "RadioButton" , undefined , { en: "Duration" , fr: "Durée :" } );
            Row1.Selector.characters = 8 ;
            Row1.Selector.value = true ;
            var LengthWanted = Row1.add( "EditText{ text : '' , justify : 'center' , characters : 10 , properties : { enabled : true } }" );
            var LengthUnitsA = Row1.add( "RadioButton" , undefined , "Fr");
            LengthUnitsA.value = true ;
            var LengthUnitsB = Row1.add( "RadioButton" , undefined , "Sec");
        var Row2 = CompLengthChoiceDlg.global.add( "Group" , undefined );
        Row2.orientation = "Row";
        Row2.spacing = 5 ;
        Row2.alignChildren = [ "Left" , "Center" ];
            Row2.Selector = Row2.add( "RadioButton" , undefined , { en: "Ref Layer :" , fr: "Calque Ref :" } );
            Row2.Selector.characters = 8 ;
            var LayerRefChoice = Row2.add( "DropDownList" , undefined , GetListOfLayers() )
            LayerRefChoice.itemSize[0] = 71 ;
            LayerRefChoice.selection = LayerRefChoice.items[0];
            var RefreshLayerList = Row2.add( "Button" , undefined , { en: "Refresh" , fr: "Actualiser" } );
            RefreshLayerList.size = [ 75 , 25 ];
        var ChangeLenght = CompLengthChoiceDlg.global.add( "Button" , undefined , { en: "Modify" , fr: "Modifier" } );
        ChangeLenght.size = [ 75 , 25 ];
    Row1.Selector.onClick = function () { Row2.Selector.value = false };
    Row2.Selector.onClick = function () { Row1.Selector.value = false };
    LengthWanted.onChange = function () { Row1.Selector.value = true ; Row2.Selector.value = false };
    LengthUnitsA.onClick = function () { Row1.Selector.value = true ; Row2.Selector.value = false };
    LengthUnitsB.onClick = function () { Row1.Selector.value = true ; Row2.Selector.value = false };
    LayerRefChoice.onChange = function () { Row2.Selector.value = true ; Row1.Selector.value = false };
    RefreshLayerList.onClick = function () { RefreshingLayerList( LayerRefChoice ) };
    ChangeLenght.onClick = function () { if( ChangingLength( Row2.Selector.value , LengthWanted.text , LengthUnitsA.value , LayerRefChoice.selection.text ) ){ CompLengthChoiceDlg.close(); } };
    
    CompLengthChoiceDlg.show()
    
}

//Fonction créant une liste des calques de la composition active.
//Return = Array - Un tableau avec les noms et index des calques de la composition active.
function GetListOfLayers(){
    
    var CompLayersList = [] ;
    if( app.project.activeItem != undefined && app.project.activeItem.numLayers > 0 )
    {
        for( var i = 1 ; i <= app.project.activeItem.numLayers ; i++ )
        {
            var CurrentLayer = app.project.activeItem.layer(i);
            CompLayersList.push( CurrentLayer.index + " - " + CurrentLayer.name );
        }
    } else {
        CompLayersList.push( { en: "Empty" , fr: "Vide" } );
    }
    
    return CompLayersList ;
    
}

//Fonction mettant à jour la liste des calques de la composition actuelle.
//DDList = Object - Dropdownlist à mettre à jour
//Return = Ø
function RefreshingLayerList( DDList ){
    
    DDList.removeAll();
    var CompLayersList = GetListOfLayers();
    for( var i = 0 ; i < CompLayersList.length ; i++ )
    {
        DDList.add( "item" , CompLayersList[i] );
    }
    DDList.selection = DDList.items[0];
    
}

//Fonction récupérant les valeurs nécéssaires à la conformation à la durée souhaitée de la composition
//Source = Boolean - L'utilisateur a donné un calque source | Duration = Number - Durée souhaitée | Frames = Boolean - L'utilisateur a choisi les frames | RefLayer = String - Index et Nom du calque référant indiqué par l'utilisateur, spérarés par " - "
//Return = Boolean - a réussi.
function ChangingLength( Source , Duration , Frames , RefLayer ){
    
    var LayerSelection = CTcheckSelectedLayers();
    if( LayerSelection.length > 0 )
    {
        if( !Source )
        {
            if( !isNaN( Duration ) )
            {
                for( var i = 0 ; i < LayerSelection.length ; i++ )
                {
                    var TestedLayer = LayerSelection[i] ;
                    if( TestedLayer.source.typeName == "Composition" )
                    {       
                        if( Frames )
                        {
                             Duration = Duration * TestedLayer.source.frameDuration ;
                        } 
                        app.beginUndoGroup( { en: "Managing Comp Length" , fr: "Retimage de Comps." } );
                        ManageCompLength( TestedLayer.source , Duration )
                        app.endUndoGroup();
                    }
                }
            } else {
                CTdlg( "Nope" , { en: "Error : " , fr: "Erreur : " } , { en: "   The Duration entered is not a Number" , fr: "   La durée demandée n'est pas un nombre." } );
                return false ;
            }            
        } else {
            for( var i = 0 ; i < LayerSelection.length ; i++ )
            {
                var TestedLayer = LayerSelection[i] ;
                if( TestedLayer.source.typeName == "Composition" )
                {
                    var RefLayerIndex = parseFloat( RefLayer.slice( 0 , RefLayer.indexOf( " - " ) ) );
                    Duration = app.project.activeItem.layer( RefLayerIndex ).outPoint - app.project.activeItem.layer( RefLayerIndex ).inPoint ;
                    app.beginUndoGroup( { en: "Managing Comp Length" , fr: "Retimage de Comps." } );
                    ManageCompLength( TestedLayer.source , Duration );
                    app.endUndoGroup();
                }
            }
        }
    }
    CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished changing the duration of your Comps" , fr: "J'ai fini de retimer tes Compos." } );
    return true ;
    
}

//Fonction Récursive pour allonger une composition et ses sous-éléments.
//item = Object - Composition dont il faut modifier la durée | Duration = Number - durée souhaitée en secondes
//Return = Ø
function ManageCompLength( item , Duration ){
    
    var OldDuration = item.duration ;
    item.duration = Duration ;
    
    for( var i = 0 ; i < item.usedIn.length ; i++ )
    {
        for( var j = 1 ; j <= item.usedIn[i].numLayers ; j++ )
        {
            if( item.usedIn[i].layer(j).source == item )
            {
                if( item.usedIn[i].layer(j).outPoint >= OldDuration + item.usedIn[i].layer(j).startTime || item.usedIn[i].layer(j).outPoint >= item.duration + item.usedIn[i].layer(j).startTime )
                {
                    var WasLocked = item.layer(i).locked ;
                    if( WasLocked )
                    {
                        item.usedIn[i].layer(j).locked = false ;
                    }
                    item.usedIn[i].layer(j).outPoint = item.duration + item.usedIn[i].layer(j).startTime ;
                    if( WasLocked )
                    {
                        item.usedIn[i].layer(j).locked = true ;
                    }
                }
            }
        }
    }
    
    for( i = 1 ; i <= item.numLayers ; i++)
    {
        if( item.layer(i).source != undefined && item.layer(i).source.typeName == "Composition" )
        {
            ManageCompLength( item.layer(i).source , Duration );
        } else if( item.layer(i).outPoint >= OldDuration || item.layer(i).outPoint > item.duration )
        {
            var WasLocked = item.layer(i).locked ;
            if( WasLocked )
            {
                item.layer(i).locked = false ;
            }
            item.layer(i).outPoint = item.duration ;
            
            if( WasLocked )
            {
                item.layer(i).locked = true ;
            }
        }
    }
    
}