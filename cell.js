"use strict";
class Cell{
    constructor(parent=None, position=None){

        self.parent = parent
        self.position = position
        self.g = 0
        self.h = 0
        self.f = 0
    }
} 