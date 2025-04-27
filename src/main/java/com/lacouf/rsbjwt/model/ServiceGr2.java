package com.lacouf.rsbjwt.model;


public class ServiceGr2 {

    private final ClientRepository clientRepository;

    public ServiceGr2(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client saveClient(String nom) {
        return clientRepository.saveClient(nom);
    }
}
