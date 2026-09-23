/*
 * Copyright (c) 2002-2017, Mairie de Paris
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice
 *     and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice
 *     and the following disclaimer in the documentation and/or other materials
 *     provided with the distribution.
 *
 *  3. Neither the name of 'Mairie de Paris' nor 'Lutece' nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * License 1.0
 */
package fr.paris.lutece.plugins.genericattributes.modules.googlemaps.service;

import org.junit.jupiter.api.Test;

import fr.paris.lutece.plugins.genericattributes.business.IMapProvider;
import fr.paris.lutece.plugins.genericattributes.business.MapProviderManager;
import fr.paris.lutece.test.LuteceTestCase;
import fr.paris.lutece.util.ReferenceItem;

/**
 * Tests GoogleMapsProvider.
 */
public class GoogleMapsProviderTest extends LuteceTestCase
{
    /**
     * Checks that the manager finds the provider under its key, with its name and template.
     */
    @Test
    public void testProviderIsRegistered( )
    {
        IMapProvider provider = MapProviderManager.getMapProvider( "googlemaps" );
        assertNotNull( provider );
        assertEquals( "Google Maps", provider.getDisplayedName( ) );
        assertEquals( "/admin/plugins/genericattributes/modules/googlemaps/GoogleMapsTemplate.html", provider.getHtmlCode( ) );
    }

    /**
     * Checks the reference item offered to the geolocation entry editors.
     */
    @Test
    public void testToRefItem( )
    {
        ReferenceItem item = new GoogleMapsProvider( ).toRefItem( );
        assertEquals( "googlemaps", item.getCode( ) );
        assertEquals( "Google Maps", item.getName( ) );
    }

    /**
     * Checks that the API key is empty, never null, when no key is configured.
     */
    @Test
    public void testApiKeyDefaultsToEmpty( )
    {
        assertEquals( "", new GoogleMapsProvider( ).getApiKey( ) );
    }
}
