import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import './style.css';
import { censo } from './censo';

// Token de acesso do Mapbox
const TOKEN_MAPBOX = 'pk.eyJ1IjoiZ21lcmVuY2lvIiwiYSI6ImNsMjgyYTVxODA1OXUzZG56emppeHFkd2wifQ.5NMbrQod0tTYWB0CnqqEmA';

const DEFAULT_ZOOM = 4;
const MAX_ZOOM = 14;

export const Mapa = () => {  
  // Popup aberto no momento
  const popupRef = useRef(null);
  
  // Objeto referente ao mapa
  const mapRef = useRef(null);
  
  // Fechar popup aberto no momento
  const closeCurrentPopup = () => {
  	popupRef.current._closeButton.click();
  };
  
  /* Aumentar ou diminuir zoom em uma unidade. Se increase = true,
  aumentar; se increase = false, diminuir. */
  const changeZoom = (increase) => {
  	if (increase) {
  		mapRef.current.zoomIn(1);
  	}
  	else if (!increase) {
  		mapRef.current.zoomOut(1);
  	}
  };

  return (
    <div>
    <Card variant="outlined">
    	<CardContent>
    		<Stack direction="row">
    			<Container>
    				<p>Zoom:</p>
    				<ButtonGroup variant="contained">
    					<Button onClick={() => { changeZoom(true); }}>Aumentar zoom</Button>
    					<Button onClick={() => { changeZoom(false); }}>Diminuir zoom</Button>
    				</ButtonGroup>
    			</Container>
    			
    			<Container>
    				<p>Contraste: </p>
    				<ButtonGroup variant="contained">
    					<Button>Aumentar contraste</Button>
    					<Button>Diminuir contraste</Button>
    				</ButtonGroup>
    			</Container>
    			
    			<Container>
    				<p>Brilho: </p>
    				<ButtonGroup variant="contained">
    					<Button>Aumentar brilho</Button>
    					<Button>Diminuir brilho</Button>
    				</ButtonGroup>
    			</Container>
    			
    			<Container>
    				<p>Esquema de cores: </p>
    				<ButtonGroup variant="contained">
    					<Button>Padrão</Button>
    					<Button>Preto e branco</Button>
    				</ButtonGroup>
    			</Container>
    		</Stack>
    	</CardContent>
    </Card>
    
  	<MapContainer center={[-14.2350, -51.9253]} zoom={DEFAULT_ZOOM} scrollWheelZoom={true} zoomControl={false} ref={mapRef}>
  		<TileLayer
    		attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
    		url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${TOKEN_MAPBOX}`}
    		tileSize={512}
    		zoomOffset={-1}
    		minZoom={DEFAULT_ZOOM}
    		maxZoom={MAX_ZOOM}
    		bounds={[[5.404952, -74.460703], [-34.850406, -34.082082]]}
  		/>  		
  		{
  			/* Inserir Markers e Popups no mapa baseado
  			na latitude e longitude das IES. */
  			censo.map(ies => (
  				<Marker
  					position={[ies.lat, ies.long]}
  					alt={ies['NO_IES']}
  					keyboard={true}
  				>
  					<Popup ref={popupRef} position={[ies.lat, ies.long]} maxHeight={400}>
  						<div>
  							<h2>{ies['NO_IES']}</h2>
  							<p>Endereço: {ies['end_completo_y']}</p>
  							<p>Quantidade de livros eletrônicos: {ies['QT_LIVRO_ELETRONICO']}</p>
  							<p>Quantidade de periódicos eletrônicos: {ies['QT_PERIODICO_ELETRONICO']}</p>
  							<p>Tem acesso ao portal Capes de periódicos? {ies['IN_ACESSO_PORTAL_CAPES'] === '0'? 'Não' : 'Sim'}</p>
  							<p>Tem acesso a outras bases de dados licenciadas ou compradas? {ies['IN_ACESSO_OUTRAS_BASES'] === '0'? 'Não' : 'Sim'}</p>
  							<p>Assina outras bases de dados licenciadas ou compradas? {ies['IN_ASSINA_OUTRA_BASE'] === '0'? 'Não' : 'Sim'}</p>
  							<p>Tem catálogo online? {ies['IN_CATALOGO_ONLINE'] === '0'? 'Não' : 'Sim'}</p>
  							<p>Oferece serviços pela internet? {ies['IN_SERVICO_INTERNET'] === '0'? 'Não' : 'Sim'}</p>
  							<p>Busca integrada? {ies['IN_BUSCA_INTEGRADA'] === '0'? 'Não' : 'Sim'}</p>
  							<p>Biblioteca participa de redes sociais? {ies['IN_PARTICIPA_REDE_SOCIAL'] === '0'? 'Não' : 'Sim'}</p>
  							<p>(Informações do censo de {ies['NU_ANO_CENSO']})</p>
  							<ButtonGroup orientation="vertical">
  								<Button variant="contained">Ver cadastro da instituição</Button>
  								<Button variant="contained" color="error" onClick={() => { closeCurrentPopup(); }}>Fechar</Button>
  							</ButtonGroup>
  						</div>
  					</Popup>
  				</Marker>
  			))
  		}
	</MapContainer>
	</div>
  );
};