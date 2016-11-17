import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { NavBar } from '../components/NavBar';
import { Grid, Section, Row, Col } from '../components/Grid';
import { SearchSidePanel } from '../components/SearchSidePanel';
import { SearchResultPanel } from '../components/SearchResultPanel';
import { Scrollbars } from '../components/Scrollbars';
import { ExtFacet } from '../components/ExtFacet';
import { FacetPanel } from '../components/FacetPanel';
import { FullRefsFacet } from '../components/FullRefsFacet';
import { Facets } from '../components/Facets';
import { RootState, SearchResult, SearchFacets, FilterParams, FacetKey } from '../reducers';
import * as Actions from '../actions';

const MDSpinner = require('react-md-spinner').default;

interface Props {
    dispatch?: Dispatch<Action>;
    loading: boolean;
    filterParams: FilterParams;
    result: SearchResult;
    facets: SearchFacets;
    location?: any;
    history?: any;
}

class SearchView extends React.Component<Props, void> {
    componentWillMount() {
        let count = 0;
        this.props.history.listen((arg1, {location}) => {
            if (location.query.q !== undefined && location.query.q !== '') {
                Actions.search(this.props.dispatch, location.query);
            }
        });
    }

    handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) {
            Actions.triggerSearch(this.props.dispatch, e.target['value']);
        }
    };

    handleFacetToggle = (filterParams: FilterParams) => {
        Actions.triggerFilter(this.props.dispatch, filterParams);
    };

    handlePageChange = (page: number) => {
        Actions.triggerFilter(this.props.dispatch, this.props.filterParams, page);
    };

    render() {
        const { loading, filterParams, result, facets } = this.props;

        const sidePanelStyle = {
            position: 'fixed',
            width: 300,
            hight: 700
        };
        const resultPanelStyle = {
            paddingLeft: 320,
            width: '100%'
        };

        return (
            <div>
                <NavBar onKeyDown={this.handleKeyDown} loading={this.props.loading} result={this.props.result} query={filterParams.q} />
                <Section style={{ marginTop: 80 }}>
                    <Row>
                        <Col size='is3' style={sidePanelStyle}>
                            <Scrollbars style={{ height: 600 }}>
                                <SearchSidePanel facets={facets}
                                    searchParams={filterParams}
                                    onToggle={this.handleFacetToggle} />
                            </Scrollbars>
                        </Col>
                        <Col size='is9' style={resultPanelStyle}>
                            <SearchResultPanel result={result} onPageChange={this.handlePageChange} />
                        </Col>
                    </Row>
                </Section>
            </div>
        );
    }
}

function mapStateToProps(state: RootState, props: Props): Props {
    return {
        loading: state.app.present.loading,
        filterParams: props.location.query,
        result: state.app.present.result,
        facets: state.app.present.facets
    };
}

const SearchViewContainer = connect(
    mapStateToProps
)(SearchView);

export default SearchViewContainer;