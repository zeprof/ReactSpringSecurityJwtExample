package com.lacouf.rsbjwt.model;

import lombok.Data;

public interface ClientRepository {
    Client saveClient(String nom);
}

