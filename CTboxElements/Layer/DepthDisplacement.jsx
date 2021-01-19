/*Fonctions permettant de déplacer un calque à la profondeur voulue sans changer son aspect visuel.*/

//Fonction ouvrant une fenêtre de dialogue permettant de choisir la valeur en z souhaitée. 
//Return = Ø
function DepthChoice (){
    
    var DepthChoiceDlg = new Window( "palette" , { en: "Depth displacement" , fr: "Déplacement en Z" } );
    DepthChoiceDlg.global = DepthChoiceDlg.add( "Panel" , undefined , { en: "Depth Setting : " , fr: "Choix de la valeur en Z :" } );
    DepthChoiceDlg.global.orientation = "Column" ;
        var DepthWanted = DepthChoiceDlg.global.add( "EditText{ justify : 'center' , characters : 10 , properties : { enabled : true } }" );
        DepthWanted.text = { en: 'Z wanted' , fr: 'Z voulu' };
        var MoveInDepth = DepthChoiceDlg.global.add( "Button" , undefined , { en:"Move" , fr: "Déplacer" } );

        DepthWanted.onActivate = function () { if( DepthWanted.text == { en: "Z wanted" , fr: "Z voulu" } ) { DepthWanted.text = "" ; } } ;
        DepthWanted.onChange = function () { MovingInDepth( DepthWanted.text ) } ;
        MoveInDepth.onClick  = function () { MovingInDepth( DepthWanted.text ) } ;
    
    DepthChoiceDlg.show()

}

//Fonction déplaçant le calque dans la profondeur sans changer son aspect visuel. Nécessite une caméra et que l'option 3D soit activée sur le calque. 
//Depth = Number - Position en z souhaitée.
//Return = Ø
function MovingInDepth( Depth ){

    if( !isNaN( Depth ) && app.project.activeItem != undefined )
    {
        var LayerSelection = CTcheckSelectedLayers();
        if( LayerSelection.length > 1 || LayerSelection.length == 1 && LayerSelection[0] != app.project.activeItem.activeCamera )
        {

            app.beginUndoGroup( { en: "Layer Displacement" , fr: "Déplacement du Calque." } );

            if( app.project.activeItem.activeCamera == null )
            {
                var NewCamera = app.project.activeItem.layers.addCamera( { en: "Forgotten Camera" , fr: "Caméra Oubliée" } , [ app.project.activeItem.width / 2 , app.project.activeItem.height / 2 ] );
                NewCamera.property(2).property(2).setValue( [ app.project.activeItem.width / 2 , app.project.activeItem.height / 2 , NewCamera.property(2).property(2).value[2] ] );
            }
            for( var i = 0 ; i < LayerSelection.length ; i++ )
            {
                if( LayerSelection[i] != app.project.activeItem.activeCamera )
                {
                    var MovedLayer = LayerSelection[i] ;
                    if( !MovedLayer.threeDLayer )
                    {
                        if( CTchoiceDlg( { en: "So..." , fr: "Alors..." } , { en: "The Layer \"" + LayerSelection[i].name + "\"  is not a 3D Layer.\r   Do you want me set it in 3D and Continue?" , fr: "Le Calque \"" + LayerSelection[i].name + "\"  n'est pas un calque 3D.\r   Je te le mets en 3D et on continue?" } ) )
                        {
                            LayerSelection[i].threeDLayer = true ;
                        } else {
                            app.endUndoGroup();
                            continue ;
                        }
                    }
                    //Récupération des propriétés nécessaires.
                    var CurrentTime = app.project.activeItem.time ;
                    var CurrentPosRel = MovedLayer.transform.position.value ;
                    var CurrentPos = GetCurrentPosition( MovedLayer );
                    var CurrentSize = MovedLayer.transform.scale.value ;
                    var ChosenZ = parseFloat( Depth );
                    var CameraPos = GetCurrentPosition ( app.project.activeItem.activeCamera );
                    //Calcul du ratio entre la position initiale du calque en Z et celle voulue vis à vis de la Camera.
                    var Ratio = ( ChosenZ - CameraPos[2] ) / ( CurrentPos[2] - CameraPos[2] ) ;
                    //Définition de la nouvelle position et de la nouvelle échelle.
                    var newPos = CameraPos + ( CurrentPos - CameraPos ) * Ratio - CurrentPos + CurrentPosRel ;
                    var newSize = CurrentSize * Ratio ;
                    //Application des nouvelles coordonnées et mise à l'échelle.
                    if( MovedLayer.transform.position.numKeys == 0 && MovedLayer.transform.scale.numKeys == 0)
                    {
                        MovedLayer.transform.position.setValue( newPos );
                        MovedLayer.transform.scale.setValue( newSize );
                    } else {
                        MovedLayer.transform.position.setValueAtTime( CurrentTime , newPos );
                        MovedLayer.transform.scale.setValueAtTime( CurrentTime , newSize );
                    }
                    app.endUndoGroup();
                }
            }
            CTdlg( { en: "I'm Done" , fr: "J'ai Fini" } , undefined , { en: "I've finished moving your layers." , fr: "J'ai fini de déplacer tes Calques." } );
        }
    }
    
}

//Fonction récursive déterminant la position absolue d'un calque en remontant ses éventuelles parentées
//Layer = object - Calque dont on cherche la position absolue
//return = Array
function GetCurrentPosition( Layer ){

    var CurrentPos = Layer.transform.position.value ;
    if( Layer.parent != null )
    {
        CurrentPos += GetCurrentPosition( Layer.parent )
    }
    return CurrentPos ;

}